import Title from "@/components/Title"; // adjust path if needed
import Descript from "@/components/descript";
import NavBar from "@/components/NavBar";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title />
      <Descript />
      <NavBar />
    </div>
  );
};

export default Home;
