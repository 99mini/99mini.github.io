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

export const getRepo = async (state: TPRState = "closed", category: TPRCategory = "release") => {
  try {
    const { data: resData, status } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
      owner: owner,
      repo: repo,
      state: state,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (status !== 200) {
      return null;
    }

    const releaseReg = /\[(release)\]/gim;
    const data = resData
      .filter((item) => releaseReg.test(item.title))
      .map((item) => {
        const releaseVersionMatched = item.title.match(/v\d+\.\d+\.\d/);
        let releaseVersion = "";
        if (releaseVersionMatched) {
          releaseVersion = "릴리즈 " + releaseVersionMatched[0];
        }

        return {
          id: item.id,
          title: releaseVersion,
          url: item.html_url,
          body: item.body?.replace(/\r+/g, "").replace(/\n+/g, "\n") || null,
          mergedAt: item.merged_at || new Date().toISOString(),
        };
      });
    return data.sort((a, b) => (b.mergedAt > a.mergedAt ? 1 : -1));
  } catch (error) {
    return null;
  }
};

// TODO: base.ref를 통해서 릴리즈 노트 리턴 데이터 만들기
const res = {
  url: "https://api.github.com/repos/99mini/99mini.github.io/pulls/1",
  id: 1530925032,
  node_id: "PR_kwDOEyfarM5bQA_o",
  html_url: "https://github.com/99mini/99mini.github.io/pull/1",
  diff_url: "https://github.com/99mini/99mini.github.io/pull/1.diff",
  patch_url: "https://github.com/99mini/99mini.github.io/pull/1.patch",
  issue_url: "https://api.github.com/repos/99mini/99mini.github.io/issues/1",
  number: 1,
  state: "closed",
  locked: false,
  title: "[Feature] 페이지 레이아웃 잡기",
  user: {
    login: "99mini",
    id: 43674669,
    node_id: "MDQ6VXNlcjQzNjc0NjY5",
    avatar_url: "https://avatars.githubusercontent.com/u/43674669?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/99mini",
    html_url: "https://github.com/99mini",
    followers_url: "https://api.github.com/users/99mini/followers",
    following_url: "https://api.github.com/users/99mini/following{/other_user}",
    gists_url: "https://api.github.com/users/99mini/gists{/gist_id}",
    starred_url: "https://api.github.com/users/99mini/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/99mini/subscriptions",
    organizations_url: "https://api.github.com/users/99mini/orgs",
    repos_url: "https://api.github.com/users/99mini/repos",
    events_url: "https://api.github.com/users/99mini/events{/privacy}",
    received_events_url: "https://api.github.com/users/99mini/received_events",
    type: "User",
    site_admin: false,
  },
  body:
    "## 개요\r\n" +
    "<!---- 변경 사항 및 관련 이슈에 대해 간단하게 작성해주세요. 어떻게보다 무엇을 왜 수정했는지 설명해주세요. -->\r\n" +
    "\r\n" +
    "<!---- Resolves: #(Isuue Number) -->\r\n" +
    "\r\n" +
    "홈페이지의 레이아웃을 잡습니다\r\n" +
    "- https://github.com/99mini/99mini.github.io/pull/2\r\n" +
    "- https://github.com/99mini/99mini.github.io/pull/3\r\n" +
    "- https://github.com/99mini/99mini.github.io/pull/4\r\n" +
    "\r\n" +
    "## PR 유형\r\n" +
    "어떤 변경 사항이 있나요?\r\n" +
    "\r\n" +
    "- [x] 새로운 기능 추가\r\n" +
    "- [ ] 버그 수정\r\n" +
    "- [ ] CSS 등 사용자 UI 디자인 변경\r\n" +
    "- [ ] 코드에 영향을 주지 않는 변경사항(오타 수정, 탭 사이즈 변경, 변수명 변경)\r\n" +
    "- [ ] 코드 리팩토링\r\n" +
    "- [ ] 주석 추가 및 수정\r\n" +
    "- [ ] 문서 수정\r\n" +
    "- [ ] 테스트 추가, 테스트 리팩토링\r\n" +
    "- [ ] 빌드 부분 혹은 패키지 매니저 수정\r\n" +
    "- [ ] 파일 혹은 폴더명 수정\r\n" +
    "- [ ] 파일 혹은 폴더 삭제\r\n" +
    "\r\n" +
    "## PR Checklist\r\n" +
    "- [ ] ",
  created_at: "2023-09-26T16:14:55Z",
  updated_at: "2023-10-21T12:44:03Z",
  closed_at: "2023-09-29T04:39:56Z",
  merged_at: "2023-09-29T04:39:56Z",
  merge_commit_sha: "df8e179a47450e346c02baaa9a6715e144fd19f7",
  assignee: null,
  assignees: [],
  requested_reviewers: [],
  requested_teams: [],
  labels: [],
  milestone: null,
  draft: false,
  commits_url: "https://api.github.com/repos/99mini/99mini.github.io/pulls/1/commits",
  review_comments_url: "https://api.github.com/repos/99mini/99mini.github.io/pulls/1/comments",
  review_comment_url: "https://api.github.com/repos/99mini/99mini.github.io/pulls/comments{/number}",
  comments_url: "https://api.github.com/repos/99mini/99mini.github.io/issues/1/comments",
  statuses_url: "https://api.github.com/repos/99mini/99mini.github.io/statuses/df8e179a47450e346c02baaa9a6715e144fd19f7",
  head: {
    label: "99mini:feature/layout-router",
    ref: "feature/layout-router",
    sha: "df8e179a47450e346c02baaa9a6715e144fd19f7",
    user: [Object],
    repo: [Object],
  },
  base: {
    label: "99mini:release/v0.1.0",
    ref: "release/v0.1.0",
    sha: "7d13afcf9d942ab8d274263bff797e3b1ff7f58f",
    user: [Object],
    repo: [Object],
  },
  _links: {
    self: [Object],
    html: [Object],
    issue: [Object],
    comments: [Object],
    review_comments: [Object],
    review_comment: [Object],
    commits: [Object],
    statuses: [Object],
  },
  author_association: "OWNER",
  auto_merge: null,
  active_lock_reason: null,
};
