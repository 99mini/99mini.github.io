/**
 * SSG prerender script
 * Runs after `vite build` to generate per-route HTML files for GitHub Pages.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const CONTENT_POSTS = join(process.cwd(), "content", "posts");

function getPostSlugs(): string[] {
  try {
    return readdirSync(CONTENT_POSTS)
      .filter((f: string) => f.endsWith(".md"))
      .map((f: string) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

function getStaticRoutes(): string[] {
  const slugs = getPostSlugs();
  return [
    "/",
    "/about",
    "/post",
    "/release",
    "/practice",
    "/practice/gomoku",
    ...slugs.map((s) => `/post/${s}`),
  ];
}

function writeRouteHTML(route: string, template: string): void {
  if (route === "/") return; // dist/index.html already exists

  const dir = join(DIST, route.slice(1)); // strip leading /
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), template, "utf-8");
  console.log(`  ✓ ${route}`);
}

async function main() {
  const template = readFileSync(join(DIST, "index.html"), "utf-8");
  const routes = getStaticRoutes();

  console.log(`\nPrerendering ${routes.length} routes...`);
  for (const route of routes) {
    writeRouteHTML(route, template);
  }

  // GitHub Pages: prevent Jekyll processing
  writeFileSync(join(DIST, ".nojekyll"), "", "utf-8");
  console.log("\n✓ SSG complete. .nojekyll written.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
