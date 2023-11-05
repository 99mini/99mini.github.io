"use client";
import { PRType } from "@/src/app/release/lib/get-repo";
import { useScrollAnimation } from "@/src/hook";
import moment from "moment";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Release.scss";

const formatAncher = (text: string, href: string) =>
  ["[", text, "]", "(", href, ")\n"].join("");

const convertPRUrl = (href: string, childrenPR: PRType[]) =>
  childrenPR.find((pr) => pr.url.trim() === href.trim())?.title || href;

const ReleaseCard = ({ releaseItem }: { releaseItem: PRType }) => {
  const { ref, style } = useScrollAnimation();

  const releaseVersion = [
    "# ",
    formatAncher(releaseItem.title, releaseItem.url),
  ].join("");

  const formatingBody = releaseItem.body
    ?.split("\n")
    .map((row) =>
      releaseItem.childrenPR &&
      /https:\/\/github\.com\/99mini\/99mini\.github\.io\/pull/.test(row)
        ? "- " +
          formatAncher(
            convertPRUrl(row.replace("- ", ""), releaseItem.childrenPR),
            row.replace("- ", "").replace("\r\n ", "")
          )
        : row
    )
    .join("");

  return (
    <div className="releaseCard" ref={ref} style={style}>
      <Markdown remarkPlugins={[remarkGfm]} className={"titleArea"}>
        {[
          releaseVersion,
          moment(
            releaseItem.mergedAt?.replaceAll("-", "").substring(0, 8) || ""
          ).format("YY년 MM월 DD일"),
        ].join("\n")}
      </Markdown>
      <Markdown remarkPlugins={[remarkGfm]}>{formatingBody}</Markdown>
    </div>
  );
};

const Release = ({ data }: { data: PRType[] | null }) => {
  return (
    <div className="releaseCardArea">
      {data?.map((releaseItem) => (
        <ReleaseCard key={releaseItem.id} releaseItem={releaseItem} />
      ))}
    </div>
  );
};

export default Release;
