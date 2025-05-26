import ResultsContent from "@/components/result/resultsContent";
import Title from "@/components/home/Title";
import Descript from "@/components/home/descript";

const Results = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <Title />
      <Descript />
      <ResultsContent />
    </div>
  );
};

export default Results;
