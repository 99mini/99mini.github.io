"use client";
import Link from "next/link";
import Image from "next/image";
import "./Post.scss";
import moment from "moment";

const PostContainer = ({ data }: { data: PostEntity[] }) => {
  return (
    <div>
      {data.map((postItem) => (
        <Link key={postItem.id} href={postItem.id}>
          <div className="postCard">
            <Image className="thumbnail" src={postItem.thumbnail} width={240} height={240} alt={postItem.title} />
            <div className="postCardContent">
              <span className="title">{postItem.title}</span>
              <span className="abstract">{postItem.abstract}</span>
              <span className="updatedAt">{moment(postItem.updatedAt).format("YYYY-MM-DD")}</span>
              <span className="author">{postItem.author}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostContainer;
