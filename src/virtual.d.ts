declare module "virtual:releases" {
  import type { GithubPR } from "@/types";

  const releases: GithubPR[];
  export default releases;
}

declare module "virtual:posts" {
  import type { Post } from "@/types";

  const posts: Post[];
  export default posts;
}
