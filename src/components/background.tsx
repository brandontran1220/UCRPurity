import scotty from "@/public/scotty.svg";
import Image from "next/image";

const Background = () => {
  const numImages = 30;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 grid grid-cols-8 gap-4">
      {Array.from({ length: numImages }).map((_, index) => (
        <Image
          key={index}
          src={scotty}
          alt={`scotty-${index}`}
          width={50}
          height={50}
          className="h-auto w-full opacity-50"
        />
      ))}
    </div>
  );
};

export default Background;
