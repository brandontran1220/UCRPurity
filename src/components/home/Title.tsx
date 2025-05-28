export default function Title() {
  return (
    <div className="relative mt-3 w-full px-4 text-center">
      <div className="flex items-center justify-center gap-6">
        {/* Left lines with "The Official" centered on top */}
        <div className="relative flex h-[5rem] flex-col items-center justify-center gap-3">
          {/* Centered angled label */}
          <span className="absolute inset-0 flex translate-x-[2.2rem] translate-y-[-1.1rem] rotate-[-25deg] items-center justify-center overflow-visible text-3xl font-semibold whitespace-nowrap text-black not-even:absolute md:translate-x-[9.25rem] md:translate-y-[-1.1rem] md:text-5xl">
            The Official
          </span>

          <div className="h-[3px] w-[15.75vw] bg-black md:h-[4px] md:w-[25vw]"></div>
          <div className="h-[3px] w-[15.75vw] bg-black md:h-[4px] md:w-[25vw]"></div>
          <div className="h-[3px] w-[15.75vw] bg-black md:h-[4px] md:w-[25vw]"></div>
        </div>

        {/* Title text */}
        <h1 className="text-4xl leading-none font-bold md:text-5xl">
          <span className="text-purity-blue-200">UCR</span>
          <span className="text-black">Purity</span>
        </h1>

        {/* Right lines */}
        <div className="flex h-[5rem] flex-col justify-center gap-3">
          <div className="h-[3px] w-[15.75vw] bg-black md:h-[4px] md:w-[25vw]"></div>
          <div className="h-[3px] w-[15.75vw] bg-black md:h-[4px] md:w-[25vw]"></div>
          <div className="h-[3px] w-[15.75vw] bg-black md:h-[4px] md:w-[25vw]"></div>
        </div>
      </div>
    </div>
  );
}
