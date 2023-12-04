"use client";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import "./Header.scss";
import { createPortal } from "react-dom";

const pathList = {
  about: "about",
  post: "post",
  pratice: "pratice",
} as const;

type pathKeyType = keyof typeof pathList;

const MobileNavBar = ({ isOpen }: { isOpen: boolean }) => {
  if (!document) {
    return;
  }

  return createPortal(
    <div className={`navbarBackground ${isOpen ? "open" : "close"}`}>
      <div className="mobileNavbarContainerWrapper">
        <div className={`mobileNavbarContainer`}>
          <div className="mobileNavbarCard">
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
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Header = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const handleMenu = () => setIsOpenDrawer((prev) => !prev);

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
      {<MobileNavBar isOpen={isOpenDrawer} />}
    </header>
  );
};

export default Header;
