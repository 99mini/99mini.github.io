import { MainSection } from "../containers/MainSection";
import { SideNavbar } from "../containers/SideNavbar";
import "./page.scss";

export default function Home() {
  return (
    <main className="homeMain">
      <div className="sectionWrapper">
        <MainSection />
      </div>
      <SideNavbar />
    </main>
  );
}
