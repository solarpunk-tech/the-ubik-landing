export type BlogTemplate = "market-intelligence" | "workflow" | "founder-thesis" | "visual-analysis";

export type BlogPost = {
  slug: string;
  date: string;
  updated: string;
  category: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  author: string;
  readingTime: string;
  template: BlogTemplate;
  featured?: boolean;
  ogImage?: string;
  heroLightImage?: string;
  heroDarkImage?: string;
};
