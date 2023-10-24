import { SideNavbar, MainSection } from "../containers";
import "./page.scss";

export default function Home() {
  return (
    <div className="sectionWrapper">
      <MainSection>home</MainSection>
      <SideNavbar />
    </div>
  );
}
