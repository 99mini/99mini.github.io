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

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  // posts are sorted newest-first; "next" is newer (idx - 1), "prev" is older (idx + 1)
  return {
    next: idx > 0 ? posts[idx - 1] : null,
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current || current.tags.length === 0) return [];
  const tagSet = new Set(current.tags);
  return posts.filter((p) => p.slug !== slug && p.tags.some((t) => tagSet.has(t))).slice(0, limit);
}
