"use client";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./NotionMarkDown.scss";

const NotionMarkDown = ({ post }: { post: string }) => {
  console.log(post);
  return (
    <div className="notionMarkDownCard">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code: ({ className, inline, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <>
                  <SyntaxHighlighter language={match[1]} style={atomDark} PreTag="div">
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </>
              );
            }
            return <code className={"inline"}>{children}</code>;
          },
        }}
      >
        {`${post}`}
      </Markdown>
    </div>
  );
};

export default NotionMarkDown;
