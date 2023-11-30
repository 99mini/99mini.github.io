"use client";
import PageTitle from "@/src/components/PageTitle/PageTitle";
import "./SkillStack.scss";
import { useEffect, useState } from "react";

const skillStackText = [
  "HTML",
  "CSS",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "REACTJS",
  "NEXTJS",
  "POSTGRES",
];

const skillStackTextLength = skillStackText.length;

const DELAY = 3000;

const SkillStack = () => {
  const [circularTextList, setCircularTextList] = useState(skillStackText);

  const activeIndexClassName = (index: number) => (index === 1 ? "active" : "");

  const prevIndexClassName = (index: number) => (index === 0 ? "prev" : "");

  const nextIndexClassName = (index: number) => (index === 2 ? "next" : "");

  useEffect(() => {
    const interval = setInterval(() => {
      let newArr = [];
      for (let i = 0; i < skillStackTextLength; i++) {
        const val = circularTextList[(i + 1) % skillStackTextLength];
        newArr.push(val);
      }
      setCircularTextList(newArr);
    }, DELAY);

    return () => {
      clearInterval(interval);
    };
  }, [circularTextList]);

  return (
    <>
      <PageTitle>기술 스택</PageTitle>
      <div className="carouselContainer">
        <ul className="carouselList">
          {circularTextList
            .slice(skillStackTextLength / 2 - 1, skillStackTextLength / 2 + 2)
            .map((skillStackText, index) => (
              <li
                key={skillStackText}
                className={[
                  "carouselItem",
                  activeIndexClassName(index),
                  prevIndexClassName(index),
                  nextIndexClassName(index),
                ]
                  .filter((className) => className)
                  .join(" ")
                  .trim()}
              >
                <span className="stackText">{skillStackText}</span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default SkillStack;
