import PostDetailContainer from "@/src/containers/Post/Detail";
import { Post } from "@/src/data/post";

export const generateStaticParams = async () => {
  const postList = await new Post().getPostList();

  const pageIds = postList.map((post) => post.id);

  return pageIds.map((pageId: string) => ({ pageId }));
};

const PostPage = async ({ params }: { params: { pageId: string } }) => {
  const rawMD = await new Post().getPostPage(params.pageId);
  return <PostDetailContainer rawMD={rawMD} />;
};

export default PostPage;
