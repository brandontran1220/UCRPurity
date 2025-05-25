"use client";
import Image from "next/image";
import sadRice from "@/public/sadRice.svg";
import ErrorButton from "./ErrorButton";

const Error = () => {
  return (
    <div className="font-inter relative z-10 flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-25 text-5xl font-bold">404 Page</h1>
      <div className="flex items-center gap-60">
        <Image src={sadRice} alt="sad Rice" width={450} height={450} />
        <div className="flex flex-col">
          <p className="text-center text-3xl font-medium">
            Oops! Something went wrong! <br /> We apologize!
          </p>
          <ErrorButton />
        </div>
      </div>
    </div>
  );
};

export default Error;
