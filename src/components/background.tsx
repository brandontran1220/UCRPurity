import scotty from "@/public/scotty.svg";
import Image from "next/image";

const Background = () => {
  const numImages = 40;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 grid grid-cols-5 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
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
