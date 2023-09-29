import { SideNavbar } from "../containers/SideNavbar";
import "./page.scss";

export default function Home() {
  return (
    <main className="homeMain">
      <div className="sectionWrapper">
        <section>main section 1</section>
      </div>
      <SideNavbar />
    </main>
  );
}
