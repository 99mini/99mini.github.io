import { MainSection, Release } from "@/src/containers";
import { getRepo } from "./lib/get-repo";

const ReleasePage = async () => {
  const data = await getRepo();
  return (
    <MainSection>
      <Release data={data} />
    </MainSection>
  );
};

export default ReleasePage;
