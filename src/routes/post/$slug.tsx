import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { SEO } from "@/scripts/seo";
import type { Post } from "@/types";

export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return {
      post,
      adjacent: getAdjacentPosts(params.slug),
      related: getRelatedPosts(params.slug),
    };
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
  const { post, adjacent, related } = Route.useLoaderData();

  return (
    <article className="flex flex-col gap-8">
      <SEO title={post.title} description={post.summary} path={`/post/${post.slug}`} />

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
        className="prose dark:prose-invert max-w-none prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-[var(--color-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered markdown HTML is trusted
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <PostNavigation adjacent={adjacent} />

      {related.length > 0 && <RelatedPosts posts={related} />}
    </article>
  );
}

function PostNavigation({ adjacent }: { adjacent: { prev: Post | null; next: Post | null } }) {
  const { prev, next } = adjacent;
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-8" aria-label="포스트 탐색">
      <div>
        {prev && (
          <Link
            to="/post/$slug"
            params={{ slug: prev.slug }}
            className="group flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="text-xs text-[var(--color-muted)]">← 이전 글</span>
            <span className="text-sm font-medium text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-accent)]">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            to="/post/$slug"
            params={{ slug: next.slug }}
            className="group flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-4 text-right transition-colors hover:border-[var(--color-accent)]"
          >
            <span className="text-xs text-[var(--color-muted)]">다음 글 →</span>
            <span className="text-sm font-medium text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-accent)]">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}

function RelatedPosts({ posts }: { posts: Post[] }) {
  return (
    <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-8">
      <h2 className="text-base font-semibold text-[var(--color-text)]">관련 글</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/post/$slug"
            params={{ slug: post.slug }}
            className="group flex flex-col gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
          >
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-[var(--color-text)] line-clamp-2 group-hover:text-[var(--color-accent)]">
              {post.title}
            </p>
            <time className="text-xs text-[var(--color-muted)]">{post.date}</time>
          </Link>
        ))}
      </div>
    </section>
  );
}
