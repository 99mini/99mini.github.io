import { createFileRoute } from "@tanstack/react-router";

import * as styles from "./index.css";

const GITHUB_URL = "https://github.com/99mini";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <section>
      <h1 className={styles.name}>Young Min Kim</h1>
      <p className={styles.tagline}>Frontend Engineer · Seoul</p>
      <p className={styles.intro}>
        TypeScript 와 React 로 웹을 만듭니다. 함수형 프로그래밍과 프론트엔드
        툴체인에 관심이 많습니다.
      </p>
      <a
        className={styles.githubLink}
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        github.com/99mini →
      </a>
    </section>
  );
}
