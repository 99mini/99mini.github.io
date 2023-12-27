import Link from "next/link";
import "./AsideNav.scss";

const AsideNav = ({ anchorHeadingList }: { anchorHeadingList: NotionHeadingEl[] }) => {
  const minHeadingNumber = anchorHeadingList.reduce((a, b) => Math.min(a, b.headingNumber), 4);
  return (
    <div className="asideWrapper">
      <div className="asideAbsolute">
        <aside className="anchorIndexAside">
          <ul className="anchorTagList">
            {anchorHeadingList.map((item) => {
              const marginLeft = 24 * (item.headingNumber - minHeadingNumber);
              return (
                <li key={item.id} className="anchorTagItem" style={{ marginLeft: `${marginLeft}px` }}>
                  <Link href={`#${item.id}`}>{item.text}</Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AsideNav;
