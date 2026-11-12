import { useEffect, useState } from "react";
import { DOWNLOAD_MANIFEST_URL, downloads } from "./links";

export interface DownloadLinks {
  /** Empty until the manifest is read; empty forever if the fetch fails (e.g. CORS). */
  version: string;
  mac: string;
  windows: string;
}

/**
 * Installer links are constant aliases, so they are correct from first paint.
 * Only the version label comes from the manifest, and it stays blank if the
 * fetch fails rather than showing anything stale.
 */
export function useDownloadLinks(): DownloadLinks {
  const [version, setVersion] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(DOWNLOAD_MANIFEST_URL, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled && typeof data?.version === "string") setVersion(data.version);
      })
      .catch(() => {
        // Manifest unreachable: keep the blank label; links still work.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { version, ...downloads };
}
