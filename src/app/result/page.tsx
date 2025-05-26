import ResultsContent from "@/components/result/resultsContent";
import Title from "@/components/home/Title";
import Descript from "@/components/home/descript";

const Results = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center py-8">
      <Title />
      <Descript />
      <ResultsContent />
    </div>
  );
};

export default Results;
