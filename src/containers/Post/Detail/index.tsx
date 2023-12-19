import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function PostDetailContainer({ rawMD }: { rawMD: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{rawMD}</ReactMarkdown>;
}

export default PostDetailContainer;
