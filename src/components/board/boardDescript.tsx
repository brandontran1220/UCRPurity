import Image from "next/image";
import Link from "next/link";
import Rice from "@/public/goofyRice.svg";

const boardDescript = () => {
  return (
    <div className="mx-86 my-20 flex flex-col items-center justify-center rounded-xl bg-blue-200 p-10 shadow-xl">
      <div className="felx-col font-inter flex items-center justify-center text-center text-2xl font-bold">
        <Link href="/">
          <Image src={Rice} alt="Goofy Rice" width={100} height={100} />
        </Link>
        Who We Are
      </div>
      <div className="">
        <p className="text-md font-inter text-center font-normal text-blue-800">
          We are a team of 5 UCR student developers trying to blend UCR campus
          life with tech to create something fun and relatable for our peers.
        </p>
      </div>
    </div>
  );
};

export default boardDescript;
