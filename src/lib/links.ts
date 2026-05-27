export const externalLinks = {
  app: "https://app.theubik.com",
  docs: "https://docs.theubik.com",
  founderMeeting: "https://calendar.app.google/frJjo2U6qdBdgZ1w9"
};

// Fetched at runtime by useDownloadLinks() — no-cache so every page load
// picks up the latest production release automatically.
export const DOWNLOAD_MANIFEST_URL =
  "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/latest.json";

// Shown while the manifest is loading or if the fetch fails.
export const downloadsFallback = {
  version: "...",
  mac_arm64: "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-arm64.dmg",
  mac_x64:   "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-x64.dmg",
  windows:   "https://ubik-meetings.s3.ap-south-1.amazonaws.com/desktop/latest/Ubik-Meeting-Setup.exe",
};
