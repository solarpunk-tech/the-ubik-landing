import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { JsonLd } from "./JsonLd";

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

const SITE_ORIGIN = "https://theubik.com";

/** og:image must be absolute — several scrapers will not resolve "/og-image.png". */
const absoluteUrl = (value: string) =>
  value.startsWith("http") ? value : `${SITE_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;

// A canonical entity block, rendered on every page. "Ubik" collides with the
// Philip K. Dick novel and a handful of unrelated products (search console
// data shows queries for "ubik cube", "ubik game", "ubik band" landing on
// this domain's impressions); Google and AI crawlers have no signal that
// this is the trade-ops company without one consistent entity declaration
// repeated everywhere. `disambiguatingDescription` is schema.org's field for
// exactly this: telling a crawler what this entity is not.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ubik",
  alternateName: ["Ubik AI", "Ubik App", "theubik"],
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/icon-512.png`,
  // The description above names Solarpunk Tech Inc. in prose; this states the
  // same link in a field a crawler can actually follow.
  parentOrganization: {
    "@type": "Organization",
    name: "Solarpunk Tech Inc.",
    url: "https://solarpunk.technology"
  },
  // `sameAs` is the strongest disambiguation signal in this block and is still
  // missing. It only works pointing at profiles that verifiably belong to the
  // company, and the repo has only the founders' personal LinkedIn URLs; a
  // guessed URL asserts a false identity, which is worse than none. Add the
  // company LinkedIn (plus Crunchbase/X if they exist) here once confirmed.
  description: "ubik is full-stack intelligence for cross-border trade, built by Solarpunk Tech Inc.",
  disambiguatingDescription:
    "Ubik, the software product for importers and exporters in cross-border trade at theubik.com. Not the 1969 Philip K. Dick novel, and not any other unrelated product or company also named Ubik."
};

export type SsrHead = { title: string; description: string; canonical: string; type: string; image?: string; imageAlt?: string };

// Effects do not run during the build-time render, so the prerender reads the
// page's head from here instead. Only ever written when there is no window.
const ssrHeads: SsrHead[] = [];

export function takeSsrHead() {
  // The page's own <Seo> renders last, so the latest entry wins.
  const head = ssrHeads.at(-1) ?? null;
  ssrHeads.length = 0;
  return head;
}

export function Seo({ title, description, canonical: canonicalProp, image, imageAlt, type = "website" }: SeoProps) {
  // Defaulting to the homepage made every page without an explicit canonical
  // (Learn, Download) declare itself a duplicate of "/".
  const { pathname } = useLocation();
  const canonical = canonicalProp ?? `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
  if (typeof window === "undefined") {
    ssrHeads.push({ title, description, canonical, type, image: image && absoluteUrl(image), imageAlt });
  }

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
      const resolved = absoluteUrl(image);
      setMeta('meta[property="og:image"]', "content", resolved);
      setMeta('meta[property="og:image:secure_url"]', "content", resolved);
      setMeta('meta[name="twitter:image"]', "content", resolved);
      if (imageAlt) {
        setMeta('meta[property="og:image:alt"]', "content", imageAlt);
        setMeta('meta[name="twitter:image:alt"]', "content", imageAlt);
      }
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  }, [canonical, description, image, imageAlt, title, type]);

  return <JsonLd data={ORGANIZATION_JSON_LD} />;
}
