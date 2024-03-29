import { TPRCategory, TPRState } from "@/src/data/github/repo";
import { Octokit } from "@octokit/core";

const owner = process.env.NEXT_PUBLIC_GITUB_OWNER || "99mini";
const repo = process.env.NEXT_PUBLIC_GITUB_REPO || "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITUB_PERSONAL_ACCESS_TOKEN,
});

export const revalidate = 360;

export type PRType = {
  id: number;
  title: string;
  url: string;
  body: string | null;
  mergedAt?: string | null;
};

export const getPR = async (prNumber: number) => {
  try {
    const { data: resData, status } = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner: owner,
      repo: repo,
      pull_number: prNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (status !== 200) {
      return null;
    }

    const { id, title, html_url, body } = resData;
    const data: PRType = { id, title, url: html_url, body };
    return data;
  } catch (error) {
    return null;
  }
};

export const getReleasePR = async (state: TPRState = "closed") => {
  try {
    // TODO pr이 100개가 넘어가면 페이징 기법 적용
    const { data: resData, status } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: owner,
      repo: repo,
      state: state,
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (status !== 200) {
      return null;
    }

    const data = resData
      .filter((item) => item.labels.some((label) => label.name.toLowerCase() === "release".toLowerCase()))
      .map((item) => {
        const releaseVersionMatched = item.title.match(/v\d+\.\d+\.\d/);
        let releaseVersion = "";
        if (releaseVersionMatched && releaseVersionMatched[0]) {
          releaseVersion = "릴리즈 " + releaseVersionMatched[0];
        }

        return {
          id: item.id,
          title: releaseVersion,
          url: item.html_url,
          body: item.body?.replace(/\r+/g, "").replace(/\n+/g, "\n") || null,
          mergedAt: item.merged_at || new Date().toISOString(),
        };
      })
      .sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1));

    return data;
  } catch (error) {
    return null;
  }
};
