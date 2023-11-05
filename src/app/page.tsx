import { SideNavbar, MainSection, Home } from "../containers";

const HomePage = () => {
  return (
    <div>
      <MainSection>
        <Home />
      </MainSection>
      <SideNavbar />
    </div>
  );
};

export default HomePage;
