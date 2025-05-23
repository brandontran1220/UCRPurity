import Title from "@/components/home/Title"; // adjust path if needed
import Descript from "@/components/home/descript";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title />
      <Descript />
    </div>
  );
};

export default Home;
