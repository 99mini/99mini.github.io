import { PageTitle } from "@/src/components";
import PostCard from "./PostCard";
import "./Post.scss";

const PostContainer = ({ data }: { data: PostEntity[] }) => {
  return (
    <div>
      <PageTitle>블로그</PageTitle>
      <div className="cardWrapper">
        {data.map((postItem) => (
          <PostCard key={postItem.id} postItem={postItem} />
        ))}
      </div>
    </div>
  );
};

export default PostContainer;
