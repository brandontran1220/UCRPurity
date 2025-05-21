import Image from "next/image";
import Link from "next/link";
import Rice from "@/public/happyRice.svg";
import { SiLinktree } from "react-icons/si";

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
    <div className="bg-purity-blue-200 font-inter flex w-full items-center justify-between py-1 text-black">
      <div className="pr-30">
        <p className="pl-5">Built By</p>
        <p className="pl-17 font-black">Purified Rice</p>
        <Link href="/">
          <Image src={Rice} alt="Happy Rice" width={100} height={100} />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <p>{quotes[Math.floor(Math.random() * quotes.length)]}</p>
      </div>
      <div className="pr-5 text-right">
        <Link
          href="https://linktr.ee/PurifiedRice_Members"
          className="flex items-center justify-end gap-2 pb-18 font-semibold hover:text-white hover:underline"
        >
          Follow Us On LinkedIn!
          <SiLinktree />
        </Link>
        <p>Created in May 2025</p>
        <p>@ University of California-Riverside</p>
      </div>
    </div>
  );
};

export default footer;
