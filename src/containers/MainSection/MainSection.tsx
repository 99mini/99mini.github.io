import React from "react";
import "./MainSection.scss";

const MainSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <section className={`mainSection ${className}`}>{children}</section>;
};

export default MainSection;
