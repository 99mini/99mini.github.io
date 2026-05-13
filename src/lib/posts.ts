import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import type { Post, PostFrontmatter } from "@/types";
import { PostFrontmatterSchema } from "@/types";

// Vite bundles all .md files at build time — no Node.js fs needed
const rawFiles = import.meta.glob("/content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parsePost(filepath: string, raw: string): Post {
  const slug = filepath.replace(/^.*\/(.+)\.md$/, "$1");
  const { data, content } = matter(raw);
  const frontmatter = PostFrontmatterSchema.parse(data);
  return { ...frontmatter, slug, content };
}

export function getAllPosts(): Post[] {
  return Object.entries(rawFiles)
    .map(([path, raw]) => parsePost(path, raw))
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export async function renderMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, { theme: "github-dark" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return String(result);
}
