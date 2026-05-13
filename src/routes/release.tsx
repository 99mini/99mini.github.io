import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import releases from "virtual:releases";
import { SEO } from "@/components/SEO";

export const Route = createFileRoute("/release")({
  loader: () => ({ releases }),
  component: ReleasePage,
});

function ReleasePage() {
  const { releases } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-8">
      <SEO title="Release" description="99mini GitHub 릴리즈 히스토리" path="/release" />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Release</h1>
        <p className="text-[var(--color-muted)]">GitHub 릴리즈 히스토리</p>
      </div>

      {releases.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          릴리즈 정보를 불러올 수 없습니다.
        </p>
      ) : (
        <ol className="relative border-l border-[var(--color-border)]">
          {releases.map((pr, i) => (
            <motion.li
              key={pr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="mb-8 ml-6"
            >
              <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]" />
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-400">
                    #{pr.number}
                  </span>
                  <time className="text-xs text-[var(--color-muted)]">
                    {pr.merged_at
                      ? new Date(pr.merged_at).toLocaleDateString("ko-KR")
                      : ""}
                  </time>
                </div>
                <a
                  href={pr.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {pr.title}
                </a>
                {pr.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pr.labels.map((label) => (
                      <span
                        key={label.id}
                        className="rounded-md px-1.5 py-0.5 text-xs"
                        style={{
                          backgroundColor: `#${label.color}22`,
                          color: `#${label.color}`,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
