"use client";
import React, { useState } from "react";
import "./Header.scss";

const pathList = {
  home: "",
  about: "about",
  post: "post",
  pratice: "pratice",
} as const;

type pathKeyType = keyof typeof pathList;
type pathValueType = (typeof pathList)[pathKeyType];

const Header = () => {
  return (
    <header className={"header"}>
      <nav className={"navContainer"}>
        <ul className={"navItemList"}>
          {Object.keys(pathList).map((pathKey) => {
            const path = pathKey as pathKeyType;
            return (
              <li key={path}>
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
