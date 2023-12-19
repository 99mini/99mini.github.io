import Link from "next/link";

const PostContainer = ({ data }: { data: any[] }) => {
  return (
    <div>
      {data.map((postItem) => (
        <Link key={postItem.id} href={postItem.id}>
          {postItem.id}
        </Link>
      ))}
    </div>
  );
};

export default PostContainer;
