import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SEO } from "@/components/SEO";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <SEO description="프론트엔드 개발자 99mini의 포트폴리오 & 블로그" path="/" />
      {/* Hero */}
      <section className="flex flex-col gap-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <span className="text-sm font-medium text-[var(--color-accent)]">안녕하세요 👋</span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] md:text-5xl">
            저는 <span className="text-[var(--color-accent)]">99mini</span> 입니다
          </h1>
          <p className="max-w-xl text-lg text-[var(--color-muted)] leading-relaxed">
            프론트엔드 개발자로, 사용자 경험을 중시하며 웹 기술을 탐구합니다.
            새로운 것을 배우고 만드는 것을 즐깁니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
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
        </motion.div>
      </section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">기술 스택</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "TypeScript", "React", "Next.js", "TanStack Router",
            "TailwindCSS", "Node.js", "Git",
          ].map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm text-[var(--color-muted)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
