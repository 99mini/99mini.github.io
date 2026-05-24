import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Post } from "@/types";

type Props = {
  post: Post;
  index: number;
};

export function PostCard({ post, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
    >
      <Link to="/post/$slug" params={{ slug: post.slug }}>
        <div className="flex flex-col gap-2">
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
          <h2 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-[var(--color-muted)] line-clamp-2">{post.summary}</p>
          <time className="text-xs text-[var(--color-muted)]">{post.date}</time>
        </div>
      </Link>
    </motion.article>
  );
}
