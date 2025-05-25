"use client";

import Result from "@/components/result/result";
import { useSearchParams } from "next/navigation";

const ResultsContent = () => {
  const searchParams = useSearchParams();
  const score = searchParams.get("score")
    ? parseInt(searchParams.get("score")!, 10)
    : 100;

  const validScore = Math.max(0, Math.min(100, score));

  return (
    <div>
      <Result score={validScore} />
    </div>
  );
};

export default ResultsContent;
