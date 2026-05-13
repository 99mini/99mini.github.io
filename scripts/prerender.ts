/**
 * SSG prerender script
 * Runs after `vite build` to generate per-route HTML files for GitHub Pages.
 * Also injects route-specific SEO meta tags into each HTML file.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const CONTENT_POSTS = join(process.cwd(), "content/posts");
const SITE_NAME = "99mini";
const SITE_URL = "https://99mini.github.io";
const DEFAULT_DESC = "프론트엔드 개발자 99mini의 블로그";

interface PostMeta {
  slug: string;
  title: string;
  summary: string;
}

interface RouteMeta {
  title: string;
  description: string;
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  return Object.fromEntries(
    match[1].split("\n").flatMap((line) => {
      const [k, ...rest] = line.split(":");
      return k ? [[k.trim(), rest.join(":").trim().replace(/^["']|["']$/g, "")]] : [];
    }),
  );
}

function getPostSlugs(): PostMeta[] {
  try {
    return readdirSync(CONTENT_POSTS)
      .filter((f: string) => f.endsWith(".md"))
      .map((f: string) => {
        const slug = f.replace(/\.md$/, "");
        const raw = readFileSync(join(CONTENT_POSTS, f), "utf-8");
        const data = parseFrontmatter(raw);
        return { slug, title: data.title ?? slug, summary: data.summary ?? DEFAULT_DESC };
      });
  } catch {
    return [];
  }
}

function getRouteMeta(route: string, posts: PostMeta[]): RouteMeta {
  const map: Record<string, RouteMeta> = {
    "/": { title: SITE_NAME, description: "프론트엔드 개발자 99mini의 포트폴리오 & 블로그" },
    "/about": { title: `About | ${SITE_NAME}`, description: "99mini 소개, 경력, 프로젝트 정보" },
    "/post": { title: `Blog | ${SITE_NAME}`, description: "99mini의 개발 블로그 — 기술 글 모음" },
    "/release": { title: `Release | ${SITE_NAME}`, description: "99mini GitHub 릴리즈 히스토리" },
    "/practice": { title: `Practice | ${SITE_NAME}`, description: "인터랙티브 실험 & 미니 게임 모음" },
    "/practice/gomoku": { title: `고누 (오목) | ${SITE_NAME}`, description: "클래식 오목 게임" },
    "/404": { title: `404 | ${SITE_NAME}`, description: "페이지를 찾을 수 없습니다." },
  };

  if (map[route]) return map[route];

  const slugMatch = route.match(/^\/post\/(.+)$/);
  if (slugMatch) {
    const post = posts.find((p) => p.slug === slugMatch[1]);
    if (post) return { title: `${post.title} | ${SITE_NAME}`, description: post.summary };
  }

  return { title: SITE_NAME, description: DEFAULT_DESC };
}

function injectMeta(html: string, route: string, meta: RouteMeta): string {
  const url = `${SITE_URL}${route === "/" ? "" : route}`;
  const ogImage = `${SITE_URL}/og-default.png`;

  const tags = `
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />`;

  // Replace placeholder title and append og tags
  return html
    .replace(/<title>.*?<\/title>/, "")
    .replace("</head>", `${tags}\n  </head>`);
}

function writeRouteHTML(route: string, template: string, meta: RouteMeta): void {
  const html = injectMeta(template, route, meta);

  if (route === "/") {
    writeFileSync(join(DIST, "index.html"), html, "utf-8");
    return;
  }

  const dir = join(DIST, route.slice(1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf-8");
  console.log(`  ✓ ${route}`);
}

async function main() {
  const template = readFileSync(join(DIST, "index.html"), "utf-8");
  const posts = getPostSlugs();

  const routes = [
    "/",
    "/about",
    "/post",
    "/release",
    "/practice",
    "/practice/gomoku",
    ...posts.map((p) => `/post/${p.slug}`),
  ];

  console.log(`\nPrerendering ${routes.length} routes...`);
  for (const route of routes) {
    const meta = getRouteMeta(route, posts);
    writeRouteHTML(route, template, meta);
  }

  // 404.html — GitHub Pages serves this for unknown routes
  const meta404 = getRouteMeta("/404", posts);
  const html404 = injectMeta(template, "/404", meta404);
  writeFileSync(join(DIST, "404.html"), html404, "utf-8");
  console.log("  ✓ 404.html");

  // Prevent Jekyll processing
  writeFileSync(join(DIST, ".nojekyll"), "", "utf-8");
  console.log("\n✓ SSG complete\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
