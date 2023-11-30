import { PRType } from "@/src/app/release/lib/get-repo";
import { About, Release, SkillStack } from "..";
import "./Home.scss";

const Home = ({ releaseData }: { releaseData: PRType[] | null }) => {
  return (
    <>
      <About />
      <SkillStack />
      <Release data={releaseData} />
    </>
  );
};

export default Home;
