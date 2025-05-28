export default function Title() {
  return (
    <div className="relative mt-3 w-full px-4 text-center">
      <div className="flex items-center justify-center gap-6">
        {/* Left lines with "The Official" centered on top */}
        <div className="relative flex h-[5rem] flex-col items-center justify-center gap-3">
          {/* Centered angled label */}
          <span className="text-3xl translate-y-[-1.1rem] translate-x-[2.2rem] not-even:absolute inset-0 flex md:translate-y-[-1.2rem] md:translate-x-[11.25rem] rotate-[-25deg] items-center justify-center overflow-visible md:text-5xl font-semibold whitespace-nowrap text-black">
            The Official
          </span>

          <div className="h-[3px] w-[18.75vw] md:h-[4px] md:w-[25vw] bg-black"></div>
          <div className="h-[3px] w-[18.75vw] md:h-[4px] md:w-[25vw] bg-black"></div>
          <div className="h-[3px] w-[18.75vw] md:h-[4px] md:w-[25vw] bg-black"></div>
        </div>

        {/* Title text */}
        <h1 className="text-4xl md:text-5xl leading-none font-bold">
          <span style={{ color: "#008CFF" }}>UCR</span>
          <span className="text-black">Purity</span>
        </h1>

        {/* Right lines */}
        <div className="flex h-[5rem] flex-col justify-center gap-3">
          <div className="h-[3px] w-[18.75vw] md:h-[4px] md:w-[25vw] bg-black"></div>
          <div className="h-[3px] w-[18.75vw] md:h-[4px] md:w-[25vw] bg-black"></div>
          <div className="h-[3px] w-[18.75vw] md:h-[4px] md:w-[25vw] bg-black"></div>
        </div>
      </div>
    </div>
  );
}
