export type BlogTemplate = "market-intelligence" | "workflow" | "founder-thesis" | "visual-analysis";

export type BlogCategorySlug = "seafood" | "agri" | "dairy" | "poultry";

export type BlogCategory = {
  slug: BlogCategorySlug;
  label: string;
  description: string;
  emptyState: string;
};

export type BlogPost = {
  slug: string;
  date: string;
  updated: string;
  category: string;
  categorySlugs?: BlogCategorySlug[];
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
