"use client";
import { useRouter } from "next/navigation";

const SubmitButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/stats");
  };

  return (
    <div className="my-10 flex justify-center">
      <button
        onClick={handleClick}
        className="rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        Submit & View Results
      </button>
    </div>
  );
};

export default SubmitButton;
