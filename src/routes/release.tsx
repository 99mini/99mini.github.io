import releases from "virtual:releases";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SEO } from "@/components/SEO";
import type { GithubRelease } from "@/types";

export const Route = createFileRoute("/release")({
  loader: () => ({ releases }),
  component: ReleasePage,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReleasePage() {
  const { releases } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-8">
      <SEO title="Release" description="99mini 릴리즈 히스토리" path="/release" />
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Release</h1>
      </div>

      {releases.length === 0 ? (
        <p className="text-[var(--color-muted)]">릴리즈 정보를 불러올 수 없습니다.</p>
      ) : (
        <ol className="relative border-l border-[var(--color-border)] flex flex-col gap-0">
          {releases.map((release, i) => (
            <ReleaseItem key={release.id} release={release} index={i} />
          ))}
        </ol>
      )}
    </div>
  );
}

function ReleaseItem({ release, index }: { release: GithubRelease; index: number }) {
  const lines = (release.body ?? "").split("\n").filter((l) => l.trim() !== "");

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="mb-8 ml-6"
    >
      <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]" />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3">
        {/* header */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--color-accent)]/15 px-2.5 py-0.5 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/25 transition-colors font-mono"
          >
            {release.tag_name}
          </a>
          {release.prerelease && (
            <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-500">
              pre-release
            </span>
          )}
          <time className="ml-auto text-xs text-[var(--color-muted)]">
            {formatDate(release.published_at)}
          </time>
        </div>

        {/* release name (if different from tag) */}
        {release.name && release.name !== release.tag_name && (
          <p className="font-medium text-[var(--color-text)]">{release.name}</p>
        )}

        {/* release notes */}
        {lines.length > 0 && (
          <ul className="flex flex-col gap-1">
            {lines.map((line) => {
              const clean = line.replace(/^[-*]\s*/, "").trim();
              if (!clean) return null;
              return (
                <li
                  key={clean}
                  className="flex items-start gap-2 text-sm text-[var(--color-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]/50" />
                  <span>{clean}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.li>
  );
}
