import { SideNavbar, MainSection, Home } from "../containers";
import "./page.scss";

const HomePage = () => {
  return (
    <div className="sectionWrapper">
      <MainSection>
        <Home />
      </MainSection>
      <SideNavbar />
    </div>
  );
};

export default HomePage;
