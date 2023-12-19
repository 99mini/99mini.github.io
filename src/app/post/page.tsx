import React from "react";
import PostContainer from "@/src/containers/Post";
import { Post } from "./data";

const PostPage = async () => {
  const data = await Post.getPostList();

  return <PostContainer data={data} />;
};

export default PostPage;
