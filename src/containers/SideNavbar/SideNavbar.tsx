"use client";

import React, { useEffect, useState } from "react";
import "./SideNavbar.scss";
import LastPageIcon from "@mui/icons-material/LastPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SideNavbar = () => {
  const [isTopDisable, setIsTopDisable] = useState(true);
  const [isScroll, setIsScroll] = useState(false);

  const handleScrollPostion = (destination: number) => {
    window.scrollTo({ top: destination });
  };

  const handleScroll = () => {
    const { scrollY } = window;
    setIsTopDisable(scrollY < 200);
    setIsScroll(scrollY > 72);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <aside className={`asideNavbar${isScroll ? " visible" : ""}`}>
      <div className="contentWrapper">
        <ul className="buttonList">
          <li className="buttonItem">
            <button
              className="moveToButton"
              disabled={isTopDisable}
              onClick={() => handleScrollPostion(0)}
            >
              <LastPageIcon style={{ transform: "rotate(-90deg)" }} />
            </button>
          </li>
          <li className="buttonItem">
            <button
              className="moveToButton"
              onClick={() =>
                handleScrollPostion(document.documentElement.offsetHeight)
              }
            >
              <ExpandMoreIcon />
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideNavbar;
