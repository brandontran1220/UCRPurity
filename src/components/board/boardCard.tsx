import Image from "next/image";
import { StaticImageData } from "next/image";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";

interface BoardProps {
  linkedin: string;
  name: string;
  image: StaticImageData;
}

const BoardCard = ({ linkedin, name, image }: BoardProps) => {
  return (
    <div className="font-inter flex flex-col items-center">
      <div className="relative flex h-40 w-40 md:h-60 md:w-60">
        <Image
          src={image}
          alt="boardmember"
          width={80}
          height={80}
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div className="text-purity-blue-100 m-2 flex items-center text-center text-base font-semibold md:text-xl">
        <p>{name}</p>
        <p className="ml-3 hover:text-black">
          <Link href={linkedin}>
            <FaLinkedin />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BoardCard;
