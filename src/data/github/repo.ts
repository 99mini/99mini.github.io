export const getReleasePR = async ({
  category,
  state,
}: {
  category: TPRCategory;
  state: TPRState;
}) => {
  try {
    const url =
      "/api/github/repo?" +
      new URLSearchParams(
        JSON.stringify({
          category: category,
          state: state,
        })
      );
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 200 && data.data) {
      const pullRequestData: TReleasePR = data.data;
      return pullRequestData;
    }
  } catch (error) {}
};

export type TPRState = "closed" | "open" | "all" | undefined;
export type TPRCategory = "release" | "feature" | "bugfix" | undefined;
