import Image from "next/image";
import Rice from "@/public/goofyRice.svg";

const boardDescript = () => {
  return (
    <div className="relative mx-auto my-20 flex w-145 flex-col items-center justify-center rounded-xl bg-blue-200 p-10 shadow-xl">
      <div className="mb-10 flex w-full items-center justify-center">
        <div className="absolute left-30">
          <Image src={Rice} alt="Goofy Rice" width={100} height={100} />
        </div>
        <p className="font-inter text-center text-2xl font-bold">Who We Are</p>
      </div>
      <div>
        <p className="text-md font-inter text-center font-normal text-blue-800">
          We are a team of 5 UCR student developers trying to blend UCR campus
          life with tech to create something fun and relatable for our peers.
        </p>
      </div>
    </div>
  );
};

export default boardDescript;
