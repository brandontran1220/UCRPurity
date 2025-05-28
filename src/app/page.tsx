import Title from "@/components/home/Title";
import Descript from "@/components/home/descript";
import Questions from "@/components/home/questions";

const Home = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-4 md:py-8">
      <Title />
      <Descript />
      <Questions />
    </div>
  );
};

export default Home;
