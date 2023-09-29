"use client";
import React, { useState } from "react";
import "./Header.scss";
import MenuIcon from "@mui/icons-material/Menu";

const pathList = {
  // home: "",
  about: "about",
  post: "post",
  pratice: "pratice",
} as const;

type pathKeyType = keyof typeof pathList;

const Header = () => {
  const handleMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {};

  return (
    <header className="header">
      <nav className="navContainer">
        <ul className="navItemList">
          <li className="navItem">
            <button className="linkItem" onClick={handleMenu}>
              <MenuIcon />
            </button>
          </li>
          <li className="navItem">
            <a href="/" className="linkItem">
              {"0mini99.dev"}
            </a>
          </li>
        </ul>
        <ul className="navItemList">
          {Object.keys(pathList).map((pathKey) => {
            const path = pathKey as pathKeyType;
            return (
              <li key={path} className="navItem">
                <a className={"linkItem"} href={"/" + pathList[path]}>
                  {pathKey}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
