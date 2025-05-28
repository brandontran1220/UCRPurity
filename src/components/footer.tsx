import Image from "next/image";
import Link from "next/link";
import Rice from "@/public/happyRice.svg";
import { FaLinkedin } from "react-icons/fa";

const quotes = [
  "Live your life to the fullest and enjoy every moment!",
  "Life is a journey, not a destination.",
  "Happiness is not something ready-made. It comes from your own actions.",
  "The purpose of our lives is to be happy.",
  "You only live once, but if you do it right, once is enough.",
  "At UCR, even the oranges are proud to be Highlanders!",
  "Survived finals week at UCR—where’s my honorary degree?",
  "Powered by rice and ambition.",
  "Rice to meet you, Highlanders!",
  "Where the oranges are sweet and the finals are not.",
  "From the Bell Tower to the barn, UCR pride is everywhere.",
  "Highlander spirit: 100%, procrastination: 110%.",
  "A day without rice is like a day without sunshine at UCR.",
];

const footer = () => {
  return (
    <div className="bg-purity-blue-200 font-inter grid w-full grid-cols-1 items-center justify-between py-1 text-black md:grid-cols-3">
      <div className="flex flex-col items-center justify-center md:items-start md:pr-30">
        <p className="hidden pl-5 md:block">Built By</p>
        <p className="hidden pl-17 font-black md:block">Purified Rice</p>
        <Link href="/" className="md:justify-end">
          <Image
            src={Rice}
            alt="Happy Rice"
            className="h-[70px] w-[70px] md:h-[100px] md:w-[100px]"
          />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center text-center md:my-0">
        <p className="hidden md:block">
          {quotes[Math.floor(Math.random() * quotes.length)]}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center text-center md:items-end md:pr-5 md:text-right">
        <Link
          href="https://linktr.ee/PurifiedRice_Members"
          className="mt-3 mb-3 flex items-center justify-end gap-2 font-semibold hover:text-white hover:underline md:mb-23"
        >
          <p className="hidden md:block">Follow Us On LinkedIn!</p>
          <p className="md:hidden">Purified Rice</p>
          <p className="text-3xl md:text-xl">
            <FaLinkedin />
          </p>
        </Link>
        <p className="hidden md:block">@ University of California-Riverside</p>
        {/* <p className="md:hidden pl-5 text-2xl md:text-xl">
              <FaLinkedin />
          </p> */}
      </div>
    </div>
  );
};
export default footer;
