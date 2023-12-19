import PostDetailContainer from "@/src/containers/Post/Detail";
import { Post } from "../data";

const PostPage = async ({ params }: { params: { pageId: string } }) => {
  const data = await Post.getPostPage(params.pageId);

  return <PostDetailContainer rawMD={data} />;
};

export default PostPage;
