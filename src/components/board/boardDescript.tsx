import Image from "next/image";
import Rice from "@/public/goofyRice.svg";

const boardDescript = () => {
  return (
    <div className="relative mx-auto my-20 flex w-60 flex-col items-center justify-center rounded-xl bg-blue-200 p-5 shadow-xl md:w-145 md:p-10">
      <div className="mb-3 flex flex-col items-center justify-center md:mb-10 md:w-full md:flex-row">
        <div className="flex items-center md:absolute md:left-30">
          <Image
            src={Rice}
            alt="Goofy Rice"
            className="h-[60px] w-[60px] md:h-[100px] md:w-[100px]"
          />
        </div>
        <p className="font-inter text-center text-lg font-bold md:text-2xl">
          Who We Are
        </p>
      </div>
      <div>
        <p className="font-inter text-center text-sm font-normal text-blue-800 md:text-base">
          We are a team of 5 UCR student developers trying to blend UCR campus
          life with tech to create something fun and relatable for our peers.
        </p>
      </div>
    </div>
  );
};

export default boardDescript;
