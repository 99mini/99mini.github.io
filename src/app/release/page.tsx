import { MainSection, Release } from "@/src/containers";
import { getReleasePR } from "./lib/get-repo";

const ReleasePage = async () => {
  const data = await getReleasePR();
  return (
    <MainSection>
      <Release data={data} />
    </MainSection>
  );
};

export default ReleasePage;
