"use client";
import { useScrollAnimation } from "@/src/hook";
import "./About.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageTitle } from "@/src/components";

const AboutCard = ({ title, markdownContent }: { title?: string; markdownContent: string }) => {
  const { ref, style } = useScrollAnimation();
  return (
    <div ref={ref} style={style} className="aboutCard">
      {title && <h3 className="cardTitle">{title}</h3>}
      <Markdown remarkPlugins={[remarkGfm]} className="markDownContainer">
        {markdownContent}
      </Markdown>
    </div>
  );
};

const About = () => {
  return (
    <>
      <PageTitle>{"신입 프론트 엔드 개발자 김영민입니다."}</PageTitle>
      <div className="aboutLayout">
        <AboutCard markdownContent={["신입 프론트 엔드 개발자 김영민입니다."].join("\n")} />
        <AboutCard title="기술" markdownContent={[`- React`, `- Typescript`, `- Sass`].join("\n")} />
        <AboutCard
          title={"경력"}
          markdownContent={[`- 2023ICT하반기인턴십 (2023.09.01 ~ 2023.12.29)`, `- 오늘의웹툰 프론트엔드 포지션(2024.02.06 ~)`].join("\n")}
        />
        <AboutCard
          title={"프로젝트"}
          markdownContent={[`- 🔗 [교내 동아리 유도부 홈페이지 제작 (2022.12 ~ 2023.02)](https://uosjudo.com "서울시립대 유도부 바로가기")`].join("\n")}
        />
        <AboutCard
          title={"교육 및 자격"}
          markdownContent={[`- 서울시립대학교 컴퓨터과학부 (2018.03 ~ )`, `- 정보처리기능사 (2019.07.18)`, `- 정보처리산업기사 (2021.08.20)`].join("\n")}
        />
        <AboutCard
          title={"기타 활동"}
          markdownContent={[
            `- 🔗 [LGCNS 코딩지니어스 (2019.03 ~ 06)](https://blog.naver.com/codinggenius_/221547478851 "코딩지니어스 블로그 바로가기")`,
            `- 🔗 [클라우드 서포터즈 구름이 (2019.09 ~ 12)](https://zero-rabbit.tistory.com/category/대학활동/구름이 "구름이 활동 포스트 바로가기")`,
            `- KB국민은행 디지털 서포터즈 (2021.12.27 ~ 2022.02.28)`,
          ].join("\n")}
        />
      </div>
    </>
  );
};

export default About;
