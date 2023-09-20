"use client";
import React, { useState } from "react";
import "./Header.scss";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click button");
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className={"header"}>
      <nav className={"navContainer"}>
        <ul className={"navItemList"}>
          <li>
            <div className={"popupMenuContainer"}>
              <button onClick={handleClick}>hamburger-menu</button>
              <div className={"popupMenu"}>{}</div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
