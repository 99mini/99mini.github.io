import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { resolve } from "node:path";
import { z } from "zod";
import { GithubPRSchema } from "./src/types/index.ts";

const VIRTUAL_ID = "virtual:releases";
const RESOLVED_ID = "\0" + VIRTUAL_ID;
const REPO = "99mini/99mini.github.io";

function githubReleasesPlugin(): Plugin {
  let cache: string | null = null;

  return {
    name: "github-releases",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return;
      if (cache) return cache;

      try {
        const url = `https://api.github.com/repos/${REPO}/pulls?state=closed&per_page=50`;
        const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
        const raw = res.ok ? await res.json() : [];
        const releases = z
          .array(GithubPRSchema)
          .parse(raw)
          .filter((pr) => pr.merged_at !== null);
        cache = `export default ${JSON.stringify(releases)}`;
      } catch {
        cache = "export default []";
      }

      return cache;
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: "src/routes", generatedRouteTree: "src/routeTree.gen.ts" }),
    react(),
    tailwindcss(),
    githubReleasesPlugin(),
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
