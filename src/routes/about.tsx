import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SEO } from "@/scripts/seo";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const EXPERIENCES = [
  {
    company: "Toss Bank",
    role: "Frontend Developer",
    period: "26.01.19 ~ Present",
    tags: ["react", "nextjs16", "pandacss", "react-query"],
    description: null,
  },
  {
    company: "알렌의서재 (리비바이오)",
    role: "Frontend Engineer — 메이퓨어팀",
    period: "25.08.18 ~ 26.01.13",
    tags: ["react", "typescript", "next.js", "i18next", "emotion", "antd"],
    description: "Improving Medical Website SEO and Internationalization (i18n)",
  },
  {
    company: "오늘의웹툰 (Webtoon today)",
    companyUrl: "https://webtoon.today/",
    role: "Software Engineer — 성장팀",
    period: "24.02.06 ~ 24.09.03",
    tags: ["react", "typescript", "sass(scss)", "recoil", "storybook", "rollup"],
    description: "Webtoon Metric Development: Webtoon specific marketing solution (B2B SaaS)",
  },
  {
    company: "오늘의웹툰 (Webtoontoday) — ICT 인턴",
    role: "Frontend Engineer Intern — 성장팀",
    period: "23.09.01 ~ 23.12.31",
    tags: ["react", "typescript", "sass(scss)", "recoil", "MUI"],
    description: null,
  },
];

const PROJECTS = [
  {
    name: "24-2 Capstone Design",
    period: "24.09 ~ 12.20, 25.01 ~ 25.08",
    status: "Maintenance suspended",
    description: "Platform application for selling side dish store inventory",
    note: "Capstone Design Excellence Award (25.01.03)",
    tags: ["react-native", "typescript", "emotion", "react-query", "zustand", "react"],
    githubUrl: "https://github.com/ummgoban",
    siteUrl: "https://ummgoban.github.io/",
  },
  {
    name: "Judo Club Homepage",
    period: "22.12 ~ 23.02",
    status: "In active development",
    description: "Webpage of the Judo Club (Jiho) — SSR using Express and React",
    note: null,
    tags: ["react", "typescript", "vite", "tailwindcss", "express"],
    githubUrl: "https://github.com/uos-judo-jiho",
    siteUrl: "https://uosjudo.com/",
  },
];

const OPEN_SOURCE = [
  {
    repo: "toss/es-hangul",
    url: "https://github.com/toss/es-hangul",
    contributions: [
      { id: "#60", url: "https://github.com/toss/es-hangul/issues/60" },
      { id: "#68", url: "https://github.com/toss/es-hangul/pull/68" },
    ],
  },
  {
    repo: "modern-agile-team/modern-kit",
    url: "https://github.com/modern-agile-team/modern-kit",
    contributions: [
      {
        id: "#510",
        url: "https://github.com/modern-agile-team/modern-kit/pull/510",
      },
      {
        id: "#521",
        url: "https://github.com/modern-agile-team/modern-kit/pull/521",
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
      <SEO title="About" description="99mini 소개, 경력, 프로젝트 정보" path="/about" />

      {/* Intro */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Young Min Kim</h1>
        <p className="text-lg text-[var(--color-accent)] font-medium">99mini</p>
        <p className="text-[var(--color-muted)] leading-relaxed">
          Frontend Engineer. Interested in Functional Programming.
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {["javascript", "typescript", "react", "python"].map((tech) => (
            <code
              key={tech}
              className="rounded bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)]"
            >
              {tech}
            </code>
          ))}
        </div>
      </motion.section>

      {/* Work Experience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Work Experience</h2>
        <div className="flex flex-col gap-3">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.company + exp.period}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex flex-col gap-0.5">
                  {"companyUrl" in exp && exp.companyUrl ? (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      {exp.company} ↗
                    </a>
                  ) : (
                    <p className="font-semibold text-[var(--color-text)]">{exp.company}</p>
                  )}
                  <p className="text-sm text-[var(--color-accent)]">{exp.role}</p>
                  {exp.description && (
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{exp.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exp.tags.map((tag) => (
                      <code
                        key={tag}
                        className="rounded bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[11px] text-[var(--color-accent)]"
                      >
                        {tag}
                      </code>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-muted)]">{exp.period}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECTS.map((proj) => (
            <div
              key={proj.name}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{proj.name}</h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {proj.period}
                    {proj.status && <span className="ml-1.5 italic">· {proj.status}</span>}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    GitHub ↗
                  </a>
                  <a
                    href={proj.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    Site ↗
                  </a>
                </div>
              </div>
              <p className="text-sm text-[var(--color-muted)]">{proj.description}</p>
              {proj.note && <p className="text-xs text-[var(--color-accent)]">🏆 {proj.note}</p>}
              <div className="flex flex-wrap gap-1 mt-auto">
                {proj.tags.map((tag) => (
                  <code
                    key={tag}
                    className="rounded bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[11px] text-[var(--color-accent)]"
                  >
                    {tag}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Open Source */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Open Source</h2>
        <div className="flex flex-col gap-3">
          {OPEN_SOURCE.map((item) => (
            <div
              key={item.repo}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
              >
                {item.repo} ↗
              </a>
              <div className="flex gap-2 ml-auto">
                {item.contributions.map((c) => (
                  <a
                    key={c.id}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors"
                  >
                    {c.id}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Education */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Education</h2>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--color-text)]">University of Seoul</p>
            <p className="text-sm text-[var(--color-accent)] mt-0.5">
              B.S. in Computer Science and Engineering
            </p>
          </div>
          <span className="shrink-0 text-xs text-[var(--color-muted)]">18.03 ~ 25.02</span>
        </div>
      </motion.section>
    </div>
  );
}
