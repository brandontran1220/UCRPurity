import dirtyRice from "@/public/dirtyRice.svg";
import neutralRice from "@/public/neutralRice.svg";
import happyRice from "@/public/happyRice.svg";
import sillyRice from "@/public/sillyRice.svg";
import TakeAgainBut from "./takeAgainBut";
import ScreenshotButtonFixed from "./ScreenshotButtonFixed";
import DebugScreenshotButton from "./DebugScreenshotButton";

type ResultProps = {
  score: number;
};
export default function Result({ score }: ResultProps) {
  const riceProfiles = [
    {
      avatar: "a Dirty Rice Grain",
      message: "maybe you've done enough college..",
    },
    {
      avatar: "an Average Rice Grain",
      message: "living college to the fullest!",
    },
    {
      avatar: "a Silly Rice Grain",
      message: "you've had your fair share of UCR!",
    },
    {
      avatar: "a Pure Rice Grain",
      message: "get out and do more!",
    },
  ];
  let riceImage;
  let resultMessage;
  let avatarName;

  if (score >= 0 && score <= 25) {
    riceImage = dirtyRice;
    avatarName = riceProfiles[0].avatar;
    resultMessage = riceProfiles[0].message;
  } else if (score > 25 && score <= 50) {
    riceImage = neutralRice;
    avatarName = riceProfiles[1].avatar;
    resultMessage = riceProfiles[1].message;
  } else if (score > 50 && score <= 75) {
    riceImage = sillyRice;
    avatarName = riceProfiles[2].avatar;
    resultMessage = riceProfiles[2].message;
  } else {
    riceImage = happyRice;
    avatarName = riceProfiles[3].avatar;
    resultMessage = riceProfiles[3].message;
  }

  return (
    <div className="font-inter flex flex-col items-center justify-center">
      {/* Screenshot target container */}
      <div id="result-screenshot" className="rounded-lg bg-[#fefdf8] px-8 py-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* Use img tag instead of Next.js Image for better screenshot compatibility */}
          <img
            src={riceImage.src}
            alt="Rice character"
            width={300}
            height={300}
            style={{ width: "300px", height: "300px" }}
          />

          <div className="flex flex-col items-center justify-center md:ml-8">
            <h1 className="text-5xl font-bold text-black">Your Score</h1>
            <h2 className="text-purity-blue-200 m-[27px] text-6xl font-bold">
              {score}
            </h2>
            <p className="text-xl text-black">
              You're <span className="font-bold">{avatarName}!</span>
            </p>
            <p className="text-sm font-extralight text-gray-600 italic">
              {resultMessage}
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-2xl font-light text-black">
            Thanks for your submission!
          </p>
          <p className="m-[20px] text-xl font-light text-gray-700">
            The UCRPurity Test was created by the Purified Rice Team
          </p>
        </div>
      </div>

      {/* Buttons outside screenshot area */}
      <div className="flex items-center gap-4 pb-15">
        <TakeAgainBut />
        <ScreenshotButtonFixed
          targetId="result-screenshot"
          fileName={`ucr-purity-score-${score}`}
        />
        <DebugScreenshotButton
          targetId="result-screenshot"
          fileName={`ucr-purity-score-${score}-debug`}
        />
      </div>
    </div>
  );
}
