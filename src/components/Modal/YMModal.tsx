"use client";
import React, { createContext, useEffect, useState } from "react";
import "./YMModal.scss";
import { createPortal } from "react-dom";
import { concatClassName } from "@/src/Utils";

export type ModalPropsType = { open: boolean; onClose: () => void };
const initModalProps: ModalPropsType = { open: false, onClose: () => {} };

export const ModalContext = createContext<ModalPropsType>(initModalProps);

export const useModalContext = () => React.useContext(ModalContext);

const YMModal = ({
  open,
  onClose,
  className = "",
  style = {},
  children,
}: { children?: React.ReactNode; className?: string; style?: React.CSSProperties } & ModalPropsType) => {
  let [portalElement, setPortalElement] = useState<Element | null>(null);

  useEffect(() => {
    setPortalElement(document.getElementById("portal"));
  }, []);

  if (!portalElement) {
    return <></>;
  }

  return (
    <ModalContext.Provider value={{ open, onClose }}>
      {open &&
        createPortal(
          <div className={"YMBackDrop"}>
            <div className="YMModalWrapper">
              <div className={concatClassName("YMModalContainer", className)} style={{ ...style }}>
                {children}
              </div>
            </div>
          </div>,
          portalElement
        )}
    </ModalContext.Provider>
  );
};

const YMTitle = ({ ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) => {
  return (
    <h3 {...props} className={concatClassName("YMTitle", props.className)}>
      {props.children}
    </h3>
  );
};

const YMContext = ({ ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => {
  return (
    <p {...props} className={concatClassName("YMContext", props.className)}>
      {props.children}
    </p>
  );
};

const YMButton = ({
  modalButtonType = "default",
  ...props
}: { modalButtonType?: "cancel" | "submit" | "default" } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return (
    <button {...props} className={concatClassName(`YMButton ${modalButtonType.concat("Button")}`, props.className)}>
      {props.children}
    </button>
  );
};

YMModal.YMTitle = YMTitle;
YMModal.YMContext = YMContext;
YMModal.YMButton = YMButton;

export default YMModal;
