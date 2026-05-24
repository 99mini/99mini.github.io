import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SEO } from "@/scripts/seo";

export function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 py-24 text-center"
    >
      <SEO title="404" description="페이지를 찾을 수 없습니다." />
      <p className="text-7xl font-bold text-[var(--color-accent)]">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">페이지를 찾을 수 없습니다</h1>
        <p className="text-[var(--color-muted)]">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      </div>
      <Link
        to="/"
        className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
      >
        홈으로 돌아가기
      </Link>
    </motion.div>
  );
}
