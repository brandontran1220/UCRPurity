import Title from "@/components/Title"; // adjust path if needed
import Descript from "@/components/descript";
import SubmitButton from "@/components/SubmitButton";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title />
      <Descript />
      <SubmitButton />
    </div>
  );
};

export default Home;
