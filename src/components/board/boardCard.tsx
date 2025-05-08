import Image from "next/image";
import { StaticImageData } from "next/image";

interface BoardProps {
  position: string;
  name: string;
  image: StaticImageData;
}

const BoardCard = ({ position, name, image }: BoardProps) => {
  return (
    <div className="font-inter flex flex-col text-center">
      <div className="text-purity-black-100 mb-2">{position}</div>
      <div className="relative flex h-60 w-60">
        <Image
          src={image}
          alt="boardmember"
          width={80}
          height={80}
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div className="text-purity-blue-100 mt-2 text-xl font-semibold">
        {name}
      </div>
    </div>
  );
};

export default BoardCard;
