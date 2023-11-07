"use client";
import React from "react";
import "./PageTitle.scss";
import { useScrollAnimation } from "@/src/hook";

const PageTitle = ({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { ref, style: animationStyle } = useScrollAnimation();
  return (
    <h1
      ref={ref}
      className={`pageTitle ${className}`}
      style={{ ...style, ...animationStyle }}
    >
      {children}
    </h1>
  );
};

export default PageTitle;
