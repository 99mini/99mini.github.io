import { SideNavbar, MainSection } from "../containers";
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
