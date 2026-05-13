import type { GithubPR } from "@/types";

declare module "virtual:releases" {
  const releases: GithubPR[];
  export default releases;
}
