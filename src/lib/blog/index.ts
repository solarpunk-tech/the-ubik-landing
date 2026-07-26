export type { BlogCategory, BlogCategorySlug, BlogPost, BlogTemplate } from "@/lib/blog/types";
export { aiMonitorPost } from "@/lib/blog/ai-monitor-layer";
export { marginLeakPost } from "@/lib/blog/margin-leak";
export { originRoulettePost } from "@/lib/blog/origin-roulette";

import { aiMonitorPost } from "@/lib/blog/ai-monitor-layer";
import { marginLeakPost } from "@/lib/blog/margin-leak";
import { originRoulettePost } from "@/lib/blog/origin-roulette";
import type { BlogCategory, BlogCategorySlug, BlogPost } from "@/lib/blog/types";

export const blogCategories: BlogCategory[] = [
  {
    slug: "seafood",
    label: "Seafood",
    description: "Sourcing, margin, and workflow notes from the seafood trade desk.",
    emptyState: "Published seafood Trade Notes will appear here."
  },
  {
    slug: "agri",
    label: "Agri",
    description: "Trade notes for agricultural supply chains.",
    emptyState: "No Agri Trade Notes are published yet."
  },
  {
    slug: "dairy",
    label: "Dairy",
    description: "Trade notes for dairy operators and buyers.",
    emptyState: "No Dairy Trade Notes are published yet."
  },
  {
    slug: "poultry",
    label: "Poultry",
    description: "Trade notes for poultry supply chains.",
    emptyState: "No Poultry Trade Notes are published yet."
  }
];

export const blogPosts = [aiMonitorPost, marginLeakPost, originRoulettePost];
export const featuredBlogPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];

const seafoodSignals = /\b(seafood|shrimp|shellfish|vannamei|hslo)\b/i;

export function getBlogPostCategorySlugs(post: BlogPost): BlogCategorySlug[] {
  if (post.categorySlugs?.length) {
    return post.categorySlugs;
  }

  const searchablePostText = [post.category, post.title, post.excerpt, post.seoTitle, post.seoDescription].join(" ");
  return seafoodSignals.test(searchablePostText) ? ["seafood"] : [];
}

export function getBlogCategory(slug: BlogCategorySlug) {
  return blogCategories.find((category) => category.slug === slug) ?? null;
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
