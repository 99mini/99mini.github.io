import React from "react";
import "./Release.scss";
import { ReleasePRType } from "@/src/app/release/lib/get-repo";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";

const Release = ({ data }: { data: ReleasePRType[] | null }) => {
  return (
    <div className="releaseCardArea">
      {data?.map((releaseItem) => (
        <div key={releaseItem.id} className="releaseCard">
          <Markdown remarkPlugins={[remarkGfm]} className={"titleArea"}>
            {[
              "# " + releaseItem.title,
              moment().format(releaseItem.mergedAt || ""),
            ].join("\n")}
          </Markdown>
          <Markdown remarkPlugins={[remarkGfm]}>{releaseItem.body}</Markdown>
        </div>
      ))}
    </div>
  );
};

export default Release;
