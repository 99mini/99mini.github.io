import { TPRCategory, TPRState } from "@/src/data/github/repo";
import { Octokit } from "@octokit/core";

const owner = process.env.NEXT_PUBLIC_GITUB_OWNER || "99mini";
const repo = process.env.NEXT_PUBLIC_GITUB_REPO || "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITUB_PERSONAL_ACCESS_TOKEN,
});

export type PRType = {
  id: number;
  title: string;
  url: string;
  body: string | null;
  mergedAt?: string | null;
  childrenPR?: PRType[];
};

export const getPR = async (prNumber: number) => {
  try {
    const { data: resData, status } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner: owner,
        repo: repo,
        pull_number: prNumber,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

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

    const data = resData
      .filter((item) => item.title.toLowerCase().includes(category as string))
      .map((item) => {
        const releaseVersionMatched = item.title.match(/v\d+\.\d+\.\d/);
        let releaseVersion = "";
        if (releaseVersionMatched) {
          releaseVersion = "릴리즈 " + releaseVersionMatched[0];
        }
        const mergedPRList = item.body
          ?.split("\n")
          .filter((row) => row.startsWith("-"))
          .map(
            (url) =>
              (url
                .replace(
                  /- https:\/\/github\.com\/99mini\/99mini\.github\.io\/pull/,
                  ""
                )
                .match(/\d+/) || [])[0]
          );
        const childrenPR: PRType[] = [];
        mergedPRList?.forEach(async (prNumber) => {
          const data = await getPR(Number(prNumber));
          if (data) {
            childrenPR.push(data);
          }
        });

        return {
          id: item.id,
          title: releaseVersion,
          url: item.html_url,
          body: item.body,
          mergedAt: item.merged_at,
          childrenPR,
        };
      });
    return data;
  } catch (error) {
    return null;
  }
};
