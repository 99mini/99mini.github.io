import React from "react";
import { PostContainer } from "@/src/containers/Post";

async function getData() {
  const res = await fetch("http://localhost:3000/api/notion", { method: "GET" });

  return res.json();
}

const PostPage = async () => {
  const data = await getData();
  console.log(data);
  return <PostContainer data={data.data} />;
};

export default PostPage;
