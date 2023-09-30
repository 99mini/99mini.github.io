import { NextResponse, type NextRequest } from "next/server";
import { Octokit } from "@octokit/core";

const owner = "99mini";
const repo = "99mini.github.io";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({});

export async function GET(request: NextRequest) {
  if (request.method === "GET") {
    const { data, status } = await octokit.request("GET /", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    const res = { data, status };

    if (res.status === 200 && res.data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(res.data, { status: 200 });
    }
  }
  try {
  } catch (error) {}
}
