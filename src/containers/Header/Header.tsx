"use client";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./Header.scss";

const pathList = {
  about: "about",
  post: "post",
  pratice: "pratice",
} as const;

type pathKeyType = keyof typeof pathList;

const Header = () => {
  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

  return (
    <header className={`header dropShadow`}>
      <div className="ghostContainer" />
      <nav className="wrapContainer navContainer">
        <a href="/" className="linkItem">
          {"99mini.dev"}
        </a>
        <ul className="navItemList">
          <li className="navItem mobileNavItem">
            <button className="linkItem" onClick={handleMenu}>
              <MenuIcon />
            </button>
          </li>
          {Object.keys(pathList).map((pathKey) => {
            const path = pathKey as pathKeyType;
            return (
              <li key={path} className="navItem pcNavItem">
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
