"use client";
import React, { useState } from "react";
import "./Header.scss";

const navItems = {
  home: "",
  about: "about",
  post: "post",
  pratice: "pratice",
} as const;

type navItemsKeyType = keyof typeof navItems;
type navItemsValueType = (typeof navItems)[navItemsKeyType];

const Header = () => {
  return (
    <header className={"header"}>
      <nav className={"navContainer"}>
        <ul className={"navItemList"}>
          {Object.keys(navItems).map((item) => (
            <li key={item}>
              <a className={"linkItem"} href={"/" + item}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
