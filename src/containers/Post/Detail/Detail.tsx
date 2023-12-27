import { PageTitle } from "@/src/components";
import { NotionMarkDown } from "@/src/components/MarkDown";
import AsideNav from "./AsideNav";

function PostDetailContainer({ rawMD, title }: { rawMD: string; title: string }) {
  const headingTagRegex = /^(#+)\s([\S+| ]+)/gm;
  const anchorHeadingList: NotionHeadingEl[] = Array.from(rawMD.matchAll(headingTagRegex))
    .map((item) => {
      if (item.length < 3) {
        return null;
      }
      const headingNumber = item[1].match(/#/gm)?.length;
      if (!headingNumber || headingNumber > 3) {
        return null;
      }

      const headingText = item[2];
      const headingId = headingText.replaceAll(" ", "_");
      const ret = { headingNumber: headingNumber, id: headingId, text: headingText };
      return ret;
    })
    .filter((item) => item) as NotionHeadingEl[];
  return (
    <div>
      <AsideNav anchorHeadingList={anchorHeadingList} />
      <PageTitle>{title}</PageTitle>
      <NotionMarkDown post={rawMD} />
    </div>
  );
}

export default PostDetailContainer;
