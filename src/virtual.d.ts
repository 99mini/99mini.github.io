declare module "virtual:releases" {
  import type { GithubPR } from "@/types";
  const releases: GithubPR[];
  export default releases;
}
