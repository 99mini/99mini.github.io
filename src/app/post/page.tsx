import React from "react";
import PostContainer from "@/src/containers/Post";
import { getNotionPost } from "./lib/get-post";

const PostPage = async () => {
  const data = await getNotionPost();

  return <PostContainer data={data} />;
};

export default PostPage;
