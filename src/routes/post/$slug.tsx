import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { getPostBySlug } from "@/lib/posts";

export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: PostDetailPage,
  notFoundComponent: () => (
    <div className="flex flex-col items-center gap-4 py-16">
      <p className="text-4xl">📭</p>
      <p className="text-[var(--color-muted)]">포스트를 찾을 수 없습니다.</p>
    </div>
  ),
});

function PostDetailPage() {
  const { post } = Route.useLoaderData();

  return (
    <article className="flex flex-col gap-8">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-8"
      >
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text)] leading-tight">{post.title}</h1>
        <p className="text-[var(--color-muted)]">{post.summary}</p>
        <time className="text-sm text-[var(--color-muted)]">{post.date}</time>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
