// Markdown files in content/posts/ are parsed and rendered at build time
// by the virtualPostsPlugin in vite.config.ts and exposed as virtual:posts.
import posts from "virtual:posts";
import type { Post } from "@/types";

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
