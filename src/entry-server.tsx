import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { I18nextProvider } from "react-i18next";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App";
import i18n from "./lib/i18n";
import { takeSsrHead, type SsrHead } from "./components/seo/Seo";

/**
 * Build-time render of one route, used by scripts/prerender.mjs. Waits for
 * every lazy page chunk (onAllReady) so the HTML carries the page itself, not
 * the Suspense loader. Effects never run here, so anything browser-only must
 * stay inside useEffect.
 */
export function render(url: string): Promise<{ html: string; head: SsrHead | null }> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk.toString();
        callback();
      },
      final(callback) {
        resolve({ html, head: takeSsrHead() });
        callback();
      }
    });
    const stream = renderToPipeableStream(
      <I18nextProvider i18n={i18n}>
        <StaticRouter location={url}>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </StaticRouter>
      </I18nextProvider>,
      {
        onAllReady() {
          stream.pipe(sink);
        },
        onShellError: reject,
        onError(error) {
          reject(error);
        }
      }
    );
  });
}
