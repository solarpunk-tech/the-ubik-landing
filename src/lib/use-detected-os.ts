import { useEffect, useState } from "react";

export type OS = "mac" | "windows";

export function detectOS(): OS {
  if (typeof navigator === "undefined") return "mac";
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return "windows";
  return "mac";
}

export function useDetectedOS(): OS {
  const [os, setOS] = useState<OS>("mac");
  useEffect(() => {
    setOS(detectOS());
  }, []);
  return os;
}
