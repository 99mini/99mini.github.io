import React from "react";
import "./MainSection.scss";

const MainSection = ({ children }: { children: React.ReactNode }) => {
  return <section className="mainSection">{children}</section>;
};

export default MainSection;
