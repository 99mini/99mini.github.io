import { z } from "zod";
import { GithubPRSchema } from "@/types";

const REPO = "99mini/99mini.github.io";

export async function getReleases() {
  const url = `https://api.github.com/repos/${REPO}/pulls?state=closed&per_page=50`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return z.array(GithubPRSchema).parse(data).filter((pr) => pr.merged_at !== null);
}
