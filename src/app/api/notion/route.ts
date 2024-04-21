import { Post } from "@/src/data/post";

export async function GET() {
  const PostModule = new Post();
  const data = await PostModule.getPostList();

  return Response.json({ code: 200, data });
}
