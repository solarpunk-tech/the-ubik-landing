export type { BlogPost, BlogTemplate } from "@/lib/blog/types";
export { marginLeakPost } from "@/lib/blog/margin-leak";
export { originRoulettePost } from "@/lib/blog/origin-roulette";

import { marginLeakPost } from "@/lib/blog/margin-leak";
import { originRoulettePost } from "@/lib/blog/origin-roulette";

export const blogPosts = [marginLeakPost, originRoulettePost];
export const featuredBlogPost = blogPosts.find((post) => post.featured) ?? blogPosts[0];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
