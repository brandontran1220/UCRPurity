"use client";
import { useRouter } from "next/navigation";

const ErrorButton = () => {
  const router = useRouter();

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={() => router.push("/")}
        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default ErrorButton;
