"use client";
import Image from "next/image";
import sadRice from "@/public/sadRice.svg";
import ErrorButton from "./ErrorButton";

const Error = () => {
  return (
    <div className="font-inter relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <h1 className="mb-10 text-center text-4xl font-bold md:text-5xl">
        404 Page
      </h1>

      <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-24">
        {/* rice */}
        <Image
          src={sadRice}
          alt="Sad Rice"
          width={300}
          height={300}
          className="h-auto w-[200px] md:w-[300px] lg:w-[450px]"
        />

        {/* text and button */}
        <div className="flex flex-col items-center text-center">
          <p className="text-2xl font-medium md:text-3xl">
            Oops! Something went wrong! <br /> We apologize!
          </p>
          <ErrorButton />
        </div>
      </div>
    </div>
  );
};

export default Error;
