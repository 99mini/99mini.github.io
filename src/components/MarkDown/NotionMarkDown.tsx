"use client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Code, HeadingEl, Img } from "./TagBlock";
import "./NotionMarkDown.scss";
import Link from "next/link";

const NotionMarkDown = ({ post }: { post: string }) => {
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
                <Code language={match[1]} className={className}>
                  {children}
                </Code>
              );
            }
            return <code className="inline">{children}</code>;
          },
          img: ({ src, alt }) => <Img src={src} alt={alt} />,
          h1: ({ children }) => <HeadingEl tag="h1">{children}</HeadingEl>,
          h2: ({ children }) => <HeadingEl tag="h2">{children}</HeadingEl>,
          h3: ({ children }) => <HeadingEl tag="h3">{children}</HeadingEl>,
          a: ({ href, children }) => (
            <Link className="notionAnchor" href={href || "#"}>
              {children}
            </Link>
          ),
        }}
      >
        {`${post}`}
      </Markdown>
    </div>
  );
};

export default NotionMarkDown;
