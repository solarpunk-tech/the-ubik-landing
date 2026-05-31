import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
};

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function Seo({ title, description, canonical = "https://theubik.com/", image, imageAlt, type = "website" }: SeoProps) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    if (image) {
      setMeta('meta[property="og:image"]', "content", image);
      setMeta('meta[name="twitter:image"]', "content", image);
      if (imageAlt) {
        setMeta('meta[property="og:image:alt"]', "content", imageAlt);
        setMeta('meta[name="twitter:image:alt"]', "content", imageAlt);
      }
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  }, [canonical, description, image, imageAlt, title, type]);

  return null;
}
