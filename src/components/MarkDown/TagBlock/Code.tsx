import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "./Code.scss";

const COPY_ANIMATION_DURATION = 1500;

const Code = ({ language, className, children }: { language?: string; className?: string; children: React.ReactNode & React.ReactNode[] }) => {
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

export default Code;
