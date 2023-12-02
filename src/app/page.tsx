import { About, Home, MainSection, Release } from "../containers";
import { getRepo } from "./release/lib/get-repo";
import "./page.scss";

const HomePage = async () => {
  const releaseData = await getRepo();
  return (
    <MainSection className="homeSection">
      <Home releaseData={releaseData} />
    </MainSection>
  );
};

export default HomePage;
