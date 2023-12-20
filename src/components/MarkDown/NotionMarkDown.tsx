"use client";
import { useEffect, useRef, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { IconButton } from "@mui/material";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./NotionMarkDown.scss";

const COPY_ANIMATION_DURATION = 1500;

const CodeBlock = ({ language, className, children }: { language?: string; className?: string; children: React.ReactNode & React.ReactNode[] }) => {
  const stringifiedChildren = String(children).replace(/\n$/, "");

  const [isCopy, setIsCopy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    setIsCopy(true);
    navigator.clipboard.writeText(stringifiedChildren);
    timer.current = setTimeout(() => {
      setIsCopy(false);
    }, COPY_ANIMATION_DURATION);
  };

  useEffect(() => {
    return () => {
      if (timer && timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div className="codeBlock">
      <SyntaxHighlighter language={language} style={atomDark} PreTag="div" className={className} showLineNumbers={true}>
        {stringifiedChildren}
      </SyntaxHighlighter>
      <div className="clipboardContainer">
        <span className={`clipboardHelpText${isCopy ? " copied" : ""}`}>{"copied!"}</span>
        <IconButton className="clipboard" onClick={handleClick}>
          {isCopy ? <FileCopyIcon sx={{ color: "rgb(128, 128, 128)" }} /> : <ContentCopyIcon sx={{ color: "rgb(128, 128, 128)" }} />}
        </IconButton>
      </div>
    </div>
  );
};

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
                <CodeBlock language={match[1]} className={className}>
                  {children}
                </CodeBlock>
              );
            }
            return <code className="inline">{children}</code>;
          },
        }}
      >
        {`${post}`}
      </Markdown>
    </div>
  );
};

export default NotionMarkDown;
