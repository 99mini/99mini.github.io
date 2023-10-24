import { TPRCategory, TPRState } from "@/src/data/github/repo";
import { Octokit } from "@octokit/core";

const owner = process.env.NEXT_PUBLIC_GITUB_OWNER || "99mini";
const repo = process.env.NEXT_PUBLIC_GITUB_REPO || "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITUB_PERSONAL_ACCESS_TOKEN,
});

export const getRepo = async (state: TPRState, category: TPRCategory) => {
  const { data: resData, status } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls",
    {
      owner: owner,
      repo: repo,
      state: state,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const data = resData.filter((itme) =>
    itme.title.toLowerCase().includes(category as string)
  );

  return { data, status };
};
