import { NextResponse, type NextRequest } from "next/server";
import { Octokit } from "@octokit/core";
import { TPRCategory, TPRState } from "@/src/data/github/repo";
import { NextApiRequest } from "next";

const owner = "99mini";
const repo = "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({});

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    try {
      const url = request.nextUrl;
      const params = new URL(url.toJSON()).searchParams;
      const state = (params.get("state") || "closed") as TPRState;
      const category = params.get("category") || "release";

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
        itme.title.toLowerCase().includes(category)
      );

      return NextResponse.json({ data, status });
    } catch (error) {
      return NextResponse.json(error);
    }
  }
}
