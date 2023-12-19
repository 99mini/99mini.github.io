import React from "react";
import PostContainer from "@/src/containers/Post";
import { getPostList } from "./lib/postController";

const PostPage = async () => {
  const data = await getPostList();

  return <PostContainer data={data} />;
};

export default PostPage;
