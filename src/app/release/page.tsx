import { MainSection, Release } from "@/src/containers";
import { getRepo } from "./lib/get-repo";

const ReleasePage = async () => {
  const data = await getRepo();
  console.log(data);
  return (
    <div>
      <MainSection>
        <Release data={data} />
      </MainSection>
    </div>
  );
};

export default ReleasePage;
