import { About, Home, MainSection, Release } from "../containers";
import { getReleasePR } from "./release/lib/get-repo";
import "./page.scss";

const HomePage = async () => {
  const releaseData = await getReleasePR();
  return (
    <MainSection className="homeSection">
      <Home releaseData={releaseData} />
    </MainSection>
  );
};

export default HomePage;
