import { TPRCategory, TPRState } from "@/src/data/github/repo";
import { Octokit } from "@octokit/core";

const owner = process.env.NEXT_PUBLIC_GITUB_OWNER || "99mini";
const repo = process.env.NEXT_PUBLIC_GITUB_REPO || "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITUB_PERSONAL_ACCESS_TOKEN,
});

export type ReleasePRType = {
  id: number;
  title: string;
  url: string;
  body: string | null;
  mergedAt: string | null;
};

export const getRepo = async (
  state: TPRState = "closed",
  category: TPRCategory = "release"
) => {
  try {
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

    if (status !== 200) {
      return null;
    }

    const data: ReleasePRType[] = resData
      .filter((item) => item.title.toLowerCase().includes(category as string))
      .map((item) => {
        const releaseVersionMatched = item.title.match(/v\d+\.\d+\.\d/);
        let releaseVersion = "";
        if (releaseVersionMatched) {
          releaseVersion = releaseVersionMatched[0];
        }

        console.log(item);
        return {
          id: item.id,
          title: releaseVersion,
          url: item.url,
          body: item.body,
          mergedAt: item.merged_at,
        };
      });
    return data;
  } catch (error) {
    return null;
  }
};
