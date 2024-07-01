import { Home, MainSection } from "../containers";
import { getReleasePR } from "./release/lib/get-repo";

import "./page.scss";

const HomePage = async () => {
  const releaseData = await getReleasePR();
  return (
    <MainSection className="homeSection">
      <Home />
    </MainSection>
  );
};

export default HomePage;
