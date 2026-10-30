import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import i18n from "./lib/i18n";
import { initPostHog } from "./lib/posthog";
import { applyMatrixDrift } from "./lib/matrix-drift";
import "./index.css";

initPostHog();
applyMatrixDrift();

const rootElement = document.getElementById("root")!;
// Keep the prerendered copy on screen until the real page is ready (RevealApp).
if (document.getElementById("prerender")) rootElement.hidden = true;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <TooltipProvider>
          <App />
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
