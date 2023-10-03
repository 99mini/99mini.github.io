import "./Footer.scss";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import Link from "next/link";

const linkIconList = {
  github: <GitHubIcon key={"github-icon"} />,
  insta: <InstagramIcon key={"insta-icon"} />,
};

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footerItemList">
        <ul className="iconList">
          <li>
            <a
              href="https://github.com/99mini"
              target="_blank"
              aria-label="github"
            >
              {linkIconList.github}
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/youngmmiinn"
              target="_blank"
              aria-label="instagram"
            >
              {linkIconList.insta}
            </a>
          </li>
        </ul>
        <ul className="descriptionList">
          <li>
            <Link href={"/release"}>{"릴리즈 노트"}</Link>
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
