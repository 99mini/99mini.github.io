"use client";
import { PRType, getPR } from "@/src/app/release/lib/get-repo";
import { useScrollAnimation } from "@/src/hook";
import moment from "moment";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Release.scss";
import PageTitle from "@/src/components/PageTitle/PageTitle";

const formatAncher = (text: string, href: string) =>
  ["[", text, "]", "(", href, ")\n"].join("");

const ReleaseCard = ({ releaseItem }: { releaseItem: PRType }) => {
  const { ref, style } = useScrollAnimation();
  const [formatingBody, setFormatingBody] = useState<string>("");

  const releaseVersion = [
    "# ",
    formatAncher(releaseItem.title, releaseItem.url),
  ].join("");

  useEffect(() => {
    if (!releaseItem.body) {
      return;
    }

    const prReg = /https:\/\/github\.com\/99mini\/99mini\.github\.io\/pull/;

    const tmpFormatingBody: string[] = [];

    const promises = releaseItem.body.split("\n").map(async (row) => {
      if (prReg.test(row)) {
        const prNumber = (row.replace(prReg, "").match(/\d+/) || [])[0];
        if (Number(prNumber)) {
          const res = await getPR(Number(prNumber));
          const tmpRow =
            "- " +
              formatAncher(
                res?.title || row,
                row.replace("- ", "").replace("\r", "")
              ) || row;
          tmpFormatingBody.push(tmpRow + "\n");
          return;
        }
        tmpFormatingBody.push(row + "\n");
        return;
      }
      tmpFormatingBody.push(row + "\n");
      return;
    });
    (async () => {
      await Promise.all(promises);
      setFormatingBody(tmpFormatingBody.join(""));
    })();
  }, [releaseItem]);

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
    <>
      <PageTitle>릴리즈 노트</PageTitle>
      <div className="releaseCardArea">
        {data?.map((releaseItem) => (
          <ReleaseCard key={releaseItem.id} releaseItem={releaseItem} />
        ))}
      </div>
    </>
  );
};

export default Release;
