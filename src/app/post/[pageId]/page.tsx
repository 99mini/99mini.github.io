import { PostDetailContainer } from "@/src/containers/Post/Detail";
import { Post } from "@/src/data/post";

export const generateStaticParams = async () => {
  const postList = await new Post().getPostList();

  const pageIds = postList.map((post) => post.id);

  return pageIds.map((pageId: string) => ({ pageId }));
};

const PostPage = async ({ params }: { params: { pageId: string } }) => {
  const post = new Post();
  const rawMD = await post.getPostPage(params.pageId);
  const titleRes = await post.getPostPageProperty(params.pageId, "title");
  const title = titleRes.results[0]?.title.plain_text || "";
  return <PostDetailContainer rawMD={rawMD} title={title} />;
};

export default PostPage;
