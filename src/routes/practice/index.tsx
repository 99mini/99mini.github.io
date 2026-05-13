import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SEO } from "@/components/SEO";

export const Route = createFileRoute("/practice/")({
  component: PracticeIndexPage,
});

const ITEMS = [
  {
    to: "/practice/gomoku",
    title: "고누 (오목)",
    description: "클래식 오목 게임. 5개를 먼저 연결하면 승리!",
    emoji: "♟️",
  },
] as const;

function PracticeIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <SEO title="Practice" description="인터랙티브 실험 & 미니 게임 모음" path="/practice" />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Practice</h1>
        <p className="text-[var(--color-muted)]">인터랙티브 실험 & 미니 게임</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={item.to}
              className="group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <span className="text-3xl">{item.emoji}</span>
              <h2 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-[var(--color-muted)]">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
