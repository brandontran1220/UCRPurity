import Title from "@/components/home/Title";
import Descript from "@/components/home/descript";
import Questions from "@/components/home/questions";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title />
      <Descript />
      <Questions />
    </div>
  );
};

export default Home;
