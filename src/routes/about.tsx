import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const EXPERIENCES = [
  {
    period: "2023 - 현재",
    role: "프론트엔드 개발자",
    company: "개인 프로젝트 / 오픈소스",
    description: "React, TypeScript 기반 웹 애플리케이션 개발",
  },
];

const PROJECTS = [
  {
    name: "99mini.github.io",
    description: "개인 블로그 & 포트폴리오 사이트",
    tags: ["React", "TanStack Router", "TailwindCSS"],
    url: "https://99mini.github.io",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-[var(--color-text)]">About</h1>
        <p className="max-w-2xl text-[var(--color-muted)] leading-relaxed">
          웹 프론트엔드 개발자입니다. 사용자 친화적인 인터페이스와 성능 최적화에 관심이 많으며,
          오픈소스 기여와 개인 프로젝트를 통해 지속적으로 성장하고 있습니다.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">경력</h2>
        <div className="flex flex-col gap-4">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.company}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{exp.role}</h3>
                  <p className="text-sm text-[var(--color-accent)]">{exp.company}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{exp.description}</p>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-muted)]">{exp.period}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">프로젝트</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((proj) => (
            <a
              key={proj.name}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {proj.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{proj.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
