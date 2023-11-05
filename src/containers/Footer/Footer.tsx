import "./Footer.scss";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import Link from "next/link";

const linkIconList = {
  github: <GitHubIcon key={"github-icon"} />,
  insta: <InstagramIcon key={"insta-icon"} />,
  email: <EmailIcon key={"email-icon"} />,
};

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="wrapContainer footerItemList">
        <ul className="iconList">
          <li className="iconItem">
            <a
              href="https://github.com/99mini"
              target="_blank"
              aria-label="github"
              title="Github 바로가기"
            >
              {linkIconList.github}
            </a>
          </li>
          <li className="iconItem">
            <a
              href="https://www.instagram.com/youngmmiinn"
              target="_blank"
              aria-label="instagram"
              title="인스타그램 바로가기"
            >
              {linkIconList.insta}
            </a>
          </li>
          <li className="iconItem">
            <a
              href="mailto:0mini9939@gmail.com"
              target="_blank"
              aria-label="email"
              title="이메일 바로 보내기"
            >
              {linkIconList.email}
            </a>
          </li>
        </ul>
        <ul className="descriptionList">
          <li>
            <Link href={"/release"} title="릴리즈 노트 바로가기">
              {"릴리즈 노트"}
            </Link>
          </li>
        </ul>
        <li>
          <span className="copyRight">
            {"© 2023 99mini. All Rights Reserved."}
          </span>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
