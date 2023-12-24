import React from "react";
import { NotionMarkDown } from "@/src/components/MarkDown";
import { PageTitle } from "@/src/components";

function PostDetailContainer({ rawMD, title }: { rawMD: string; title: string }) {
  return (
    <div>
      <PageTitle>{title}</PageTitle>
      <NotionMarkDown post={rawMD} />
    </div>
  );
}

export default PostDetailContainer;
