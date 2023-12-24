import { PageTitle } from "@/src/components";
import PostCard from "./PostCard";

const PostContainer = ({ data }: { data: PostEntity[] }) => {
  return (
    <div>
      <PageTitle>블로그</PageTitle>
      {data.map((postItem) => (
        <PostCard key={postItem.id} postItem={postItem} />
      ))}
    </div>
  );
};

export default PostContainer;
