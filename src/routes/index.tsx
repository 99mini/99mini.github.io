import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SEO } from "@/components/SEO";
import { getAllPosts } from "@/lib/posts";
import type { Post } from "@/types";

export const Route = createFileRoute("/")({
  loader: () => ({ recentPosts: getAllPosts().slice(0, 3) }),
  component: HomePage,
});

function HomePage() {
  const { recentPosts } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-16 pt-8">
      <SEO description="프론트엔드 개발자 99mini의 포트폴리오 & 블로그" path="/" />

      {/* Hero */}
      <section className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <span className="text-sm font-medium text-[var(--color-accent)]">안녕하세요 👋</span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl">
            Young Min Kim
            <span className="block text-2xl font-medium text-[var(--color-muted)] mt-1 md:text-3xl">
              99mini
            </span>
          </h1>
          <p className="max-w-xl text-lg text-[var(--color-muted)] leading-relaxed">
            Frontend Engineer at{" "}
            <span className="text-[var(--color-text)] font-medium">Toss Bank</span>.
            <br />
            Interested in Functional Programming and building delightful web experiences.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["TypeScript", "React", "Next.js"].map((tech) => (
              <code
                key={tech}
                className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)]"
              >
                {tech}
              </code>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            to="/post"
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            블로그 보기
          </Link>
          <Link
            to="/about"
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]/50"
          >
            소개 보기
          </Link>
          <a
            href="https://github.com/99mini"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]"
          >
            GitHub ↗
          </a>
        </motion.div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">최근 포스트</h2>
            <Link
              to="/post"
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentPosts.map((post, i) => (
              <RecentPostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

function RecentPostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 + index * 0.08 }}
    >
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="group flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)]/50"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors truncate">
            {post.title}
          </p>
          <p className="mt-0.5 text-sm text-[var(--color-muted)] line-clamp-1">{post.summary}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <time className="text-xs text-[var(--color-muted)]">{post.date}</time>
          {post.tags.length > 0 && (
            <span className="rounded bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[10px] text-[var(--color-accent)]">
              {post.tags[0]}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
