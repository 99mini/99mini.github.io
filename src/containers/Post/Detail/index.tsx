import React from "react";
import { NotionMarkDown } from "@/src/components/MarkDown";

function PostDetailContainer({ rawMD }: { rawMD: string }) {
  return <NotionMarkDown post={rawMD} />;
}

export default PostDetailContainer;
