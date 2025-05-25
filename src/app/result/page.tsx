import Result from "@/components/result/result";

interface ResultsPageProps {
  searchParams: { score?: string };
}

const Results = ({ searchParams }: ResultsPageProps) => {
  const score = searchParams.score ? parseInt(searchParams.score, 10) : 100;

  const validScore = Math.max(0, Math.min(100, score));

  return (
    <div>
      <Result score={validScore} />
    </div>
  );
};

export default Results;
