"use client";

import Result from "@/components/result/result";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResultsContentInner() {
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
}

const ResultsContent = () => {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContentInner />
    </Suspense>
  );
};

export default ResultsContent;
