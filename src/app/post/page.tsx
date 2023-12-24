import React from "react";
import PostContainer from "@/src/containers/Post";
import { Post } from "@/src/data/post";

const PostPage = async () => {
  const data = await new Post().getPostList();
  return <PostContainer data={data} />;
};

export default PostPage;
