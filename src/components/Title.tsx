export default function Title() {
  return (
    <div className="relative mt-[-3] w-full px-4 text-center">
      <div className="flex items-center justify-center gap-6">
        {/* Left lines with "The Official" centered on top */}
        <div className="relative flex h-[5rem] flex-col items-center justify-center gap-3">
          {/* Centered angled label */}
          <span className="absolute inset-0 flex translate-x-[2.75rem] rotate-[-25deg] items-center justify-center overflow-visible text-5xl font-semibold whitespace-nowrap text-black">
            The Official
          </span>

          <div className="h-[4px] w-60 bg-black"></div>
          <div className="h-[4px] w-60 bg-black"></div>
          <div className="h-[4px] w-60 bg-black"></div>
        </div>

        {/* Title text */}
        <h1 className="text-5xl leading-none font-bold">
          <span style={{ color: "#008CFF" }}>UCR</span>
          <span className="text-black">Purity</span>
        </h1>

        {/* Right lines */}
        <div className="flex h-[5rem] flex-col justify-center gap-3">
          <div className="h-[4px] w-60 bg-black"></div>
          <div className="h-[4px] w-60 bg-black"></div>
          <div className="h-[4px] w-60 bg-black"></div>
        </div>
      </div>
    </div>
  );
}
