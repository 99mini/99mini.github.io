export const getReleasePR = async () => {
  try {
    const res = await fetch("/api/github/repo");
    const data = await res.json();
    if (data.status === 200 && data.data) {
      const pullRequestData: TReleasePR = data.data;
      return pullRequestData;
    }
  } catch (error) {}
};
