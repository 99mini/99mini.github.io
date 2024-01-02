"use client";
import Link from "next/link";
import "./HeadingEl.scss";
import { useHashAnchor } from "@/src/recoil";
import { useEffect, useRef } from "react";

type HeadingElNumber = "h1" | "h2" | "h3";

const HeadingEl = ({ children, tag }: { children: React.ReactNode & React.ReactNode[]; tag: HeadingElNumber }) => {
  const hashTargetRef = useRef<HTMLHeadingElement>(null);
  const { registHashAnchor } = useHashAnchor<HTMLHeadingElement>();

  useEffect(() => {
    registHashAnchor(hashTargetRef);
  }, [registHashAnchor]);

  if (children.length > 1) {
    if (tag === "h1") return <h1 ref={hashTargetRef}>{children}</h1>;
    if (tag === "h2") return <h2 ref={hashTargetRef}>{children}</h2>;
    if (tag === "h3") return <h3 ref={hashTargetRef}>{children}</h3>;
  }

  const hrefId = children[0]?.toString().replaceAll(" ", "_");

  if (tag === "h1") {
    return (
      <h1 ref={hashTargetRef} id={hrefId}>
        <Link className="hashAnchor" href={`#${hrefId}`}>
          {children}
        </Link>
      </h1>
    );
  }
  if (tag === "h2") {
    return (
      <h2 ref={hashTargetRef} id={hrefId}>
        <Link className="hashAnchor" href={`#${hrefId}`}>
          {children}
        </Link>
      </h2>
    );
  }
  if (tag === "h3") {
    return (
      <h3 ref={hashTargetRef} id={hrefId}>
        <Link className="hashAnchor" href={`#${hrefId}`}>
          {children}
        </Link>
      </h3>
    );
  }
  return <h1 ref={hashTargetRef}>{children}</h1>;
};

export default HeadingEl;
