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
      <Link className="thumbnailAnchor" href={postItem.id} title={`${postItem.title} 보러가기`}>
        <Image className="thumbnail" src={postItem.thumbnail} width={240} height={240} alt={postItem.title} />
      </Link>
      <div className="postCardContent">
        <Link className="detailAnchor" href={postItem.id} title={`${postItem.title} 보러가기`}>
          <h3 className="title">{postItem.title}</h3>
          <h4 className="abstract">{postItem.abstract}</h4>
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
