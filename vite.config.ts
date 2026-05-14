import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { resolve } from "node:path";
import { readdirSync, readFileSync } from "node:fs";
import { z } from "zod";
import { GithubReleaseSchema, PostFrontmatterSchema } from "./src/types/index.ts";

// ─── virtual:releases ────────────────────────────────────────────────────────

const RELEASES_VIRTUAL = "virtual:releases";
const RELEASES_RESOLVED = "\0" + RELEASES_VIRTUAL;
const REPO = "99mini/99mini.github.io";

function githubReleasesPlugin(): Plugin {
  let cache: string | null = null;

  return {
    name: "github-releases",
    resolveId(id) {
      if (id === RELEASES_VIRTUAL) return RELEASES_RESOLVED;
    },
    async load(id) {
      if (id !== RELEASES_RESOLVED) return;
      if (cache) return cache;

      try {
        const url = `https://api.github.com/repos/${REPO}/releases?per_page=50`;
        const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
        const raw = res.ok ? await res.json() : [];
        const releases = z
          .array(GithubReleaseSchema)
          .parse(raw)
          .filter((r) => !r.draft);
        cache = `export default ${JSON.stringify(releases)}`;
      } catch {
        cache = "export default []";
      }

      return cache;
    },
  };
}

// ─── virtual:posts ────────────────────────────────────────────────────────────

const POSTS_VIRTUAL = "virtual:posts";
const POSTS_RESOLVED = "\0" + POSTS_VIRTUAL;
const POSTS_DIR = resolve(__dirname, "content/posts");

async function buildPostsModule(): Promise<string> {
  const matter = (await import("gray-matter")).default;
  const { unified } = await import("unified");
  const remarkParse = (await import("remark-parse")).default;
  const remarkGfm = (await import("remark-gfm")).default;
  const remarkRehype = (await import("remark-rehype")).default;
  const rehypeShiki = (await import("@shikijs/rehype")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;

  let files: string[] = [];
  try {
    files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return "export default []";
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, { theme: "github-dark" })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const raw = readFileSync(resolve(POSTS_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().slice(0, 10);
      }
      const frontmatter = PostFrontmatterSchema.parse(data);
      const html = String(await processor.process(content));
      return { ...frontmatter, slug, html };
    }),
  );

  const result = posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return `export default ${JSON.stringify(result)}`;
}

function virtualPostsPlugin(): Plugin {
  let cache: string | null = null;

  return {
    name: "virtual-posts",
    resolveId(id) {
      if (id === POSTS_VIRTUAL) return POSTS_RESOLVED;
    },
    async load(id) {
      if (id !== POSTS_RESOLVED) return;
      if (!cache) cache = await buildPostsModule();
      return cache;
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add(POSTS_DIR);
      server.watcher.on("change", (file) => {
        if (!file.startsWith(POSTS_DIR)) return;
        cache = null;
        const mod = server.moduleGraph.getModuleById(POSTS_RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}

// ─── config ──────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    githubReleasesPlugin(),
    virtualPostsPlugin(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@content": resolve(__dirname, "content"),
    },
  },
  build: {
    outDir: "dist",
  },
});
