import Title from "@/components/Title"; // adjust path if needed
import Descript from "@/components/descript";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Title />
      <Descript />
      <Footer />
    </div>
  );
};

export default Home;
