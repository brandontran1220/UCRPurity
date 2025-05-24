import Title from "@/components/home/Title";
import Descript from "@/components/home/descript";
import Questions from "@/components/home/questions";
import SubmitButton from "@/components/SubmitButton";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title />
      <Descript />
    </div>
  );
};

export default Home;
