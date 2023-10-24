import { MainSection } from "@/src/containers";
import { getRepo } from "./lib/get-repo";

const ReleasePage = async () => {
  const { data, status } = await getRepo("open", "release");

  return (
    <div>
      <MainSection>release</MainSection>
    </div>
  );
};

export default ReleasePage;
