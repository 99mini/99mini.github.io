"use client";
import { useHashAnchor } from "@/src/recoil";
import Link from "next/link";
import React from "react";
import "./AsideNav.scss";

const AsideHashTagItem = ({ item, style = {} }: { item: NotionHeadingEl; style?: React.CSSProperties }) => {
  const { currentId } = useHashAnchor<HTMLLIElement>();

  const isCurrent = currentId === item.id;

  return (
    <li key={item.id} className="anchorTagItem" style={{ ...style }} aria-current={isCurrent}>
      <Link href={`#${item.id}`}>{item.text}</Link>
    </li>
  );
};

// TODO 이전 인덱스를 반영하여 들여쓰기 하기
const AsideNav = ({ anchorHeadingList }: { anchorHeadingList: NotionHeadingEl[] }) => {
  const minHeadingNumber = anchorHeadingList.reduce((a, b) => Math.min(a, b.headingNumber), 4);

  return (
    <div className="asideWrapper">
      <div className="asideAbsolute">
        <aside className="anchorIndexAside">
          <ul className="anchorTagList">
            {anchorHeadingList.map((item) => {
              const marginLeft = 24 * (item.headingNumber - minHeadingNumber);
              return <AsideHashTagItem item={item} key={item.id} style={{ marginLeft: `${marginLeft}px` }} />;
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AsideNav;
