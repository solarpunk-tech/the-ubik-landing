import { useEffect, useState } from "react";
import { DOWNLOAD_MANIFEST_URL, downloadsFallback } from "./links";

export interface DownloadLinks {
  version: string;
  mac_arm64: string;
  mac_x64: string;
  windows: string;
  loading: boolean;
}

/**
 * Fetches the latest.json manifest from S3 and returns live download URLs.
 * Falls back to downloadsFallback silently if the fetch fails.
 * The manifest is written by the production GitHub Actions workflow on every release.
 */
export function useDownloadLinks(): DownloadLinks {
  const [links, setLinks] = useState<DownloadLinks>({
    ...downloadsFallback,
    loading: true,
  });

  useEffect(() => {
    fetch(DOWNLOAD_MANIFEST_URL, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setLinks({
          version:   data.version               ?? downloadsFallback.version,
          mac_arm64: data.downloads?.mac_arm64  ?? downloadsFallback.mac_arm64,
          mac_x64:   data.downloads?.mac_x64    ?? downloadsFallback.mac_x64,
          windows:   data.downloads?.windows    ?? downloadsFallback.windows,
          loading:   false,
        });
      })
      .catch(() => {
        // Manifest unreachable — use fallback values so the page still works.
        setLinks((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return links;
}
