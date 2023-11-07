import { About, Home, MainSection, Release } from "../containers";
import { getRepo } from "./release/lib/get-repo";
import "./page.scss";
import PageTitle from "../components/PageTitle/PageTitle";

const HomePage = async () => {
  const releaseData = await getRepo();
  return (
    <MainSection className="homeSection">
      <About />
      {/* <Home />/ */}
      <Release data={releaseData} />
    </MainSection>
  );
};

export default HomePage;
