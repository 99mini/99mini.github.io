"use client";
import { useScrollAnimation } from "@/src/hook";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import "./PostCard.scss";

const PostCard = ({ postItem }: { postItem: PostEntity }) => {
  const { ref, style: animationStyle } = useScrollAnimation();

  return (
    <div className="postCard" ref={ref} style={{ ...animationStyle }}>
      <Link href={postItem.id}>
        <Image className="thumbnail" src={postItem.thumbnail} width={240} height={240} alt={postItem.title} />
      </Link>
      <div className="postCardContent">
        <Link href={postItem.id}>
          <div className="title">{postItem.title}</div>
          <div className="abstract">{postItem.abstract}</div>
        </Link>
        <div className="cardInfo">
          <span>{moment(postItem.updatedAt).format("YYYY-MM-DD")}</span>
          <span>{postItem.author}</span>
        </div>
        <ul className="tagCardList">
          {postItem.tags.map((tag) => (
            <li key={tag.id} className="tagChip" style={{ backgroundColor: tag.color }}>
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostCard;
