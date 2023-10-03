import { NextResponse, type NextRequest } from "next/server";
import { Octokit } from "@octokit/core";

const owner = "99mini";
const repo = "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({});

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    try {
      const { data, status } = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls",
        {
          owner: owner,
          repo: repo,
          state: "closed",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      const res = { data, status };

      const releaseData = res.data.filter((itme) =>
        itme.title.toLowerCase().includes("release")
      );

      return NextResponse.json({ releaseData, status });
    } catch (error) {
      return NextResponse.json(error);
    }
  }
}
