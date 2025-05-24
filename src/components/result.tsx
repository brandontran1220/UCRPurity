import Image from "next/image"
import sadRice from "@/public/sadRice.svg";
import neutralRice from "@/public/neutralRice.svg";
import happyRice from "@/public/happyRice.svg";
import sillyRice from "@/public/sillyRice.svg";

export default function Result({ score }) {

    const riceProfiles = [
        {
          avatar: "a Dirty Rice Grain",
          message: "Maybe you've done enough college.."
        },
        {
          avatar: "an Average Rice Grain",
          message: "Living college to the fullest!"
        },
        {
          avatar: "a Silly Rice Grain",
          message: "You've had your fair share of UCR!"
        },
        {
          avatar: "a Pure Rice Grain",
          message: "Get out and do more!"
        }
      ];
    let riceImage;
    let resultMessage;
    let avatarName;

    if (score >= 0 && score <= 25) {
        riceImage = sadRice;
        avatarName = riceProfiles[0].avatar
        resultMessage = riceProfiles[0].message
      } else if (score > 25 && score <= 50) {
        riceImage = neutralRice;
        avatarName = riceProfiles[1].avatar
        resultMessage = riceProfiles[1].message
      } else if (score > 50 && score <= 75) {
        riceImage = sillyRice;
        avatarName = riceProfiles[2].avatar
        resultMessage = riceProfiles[2].message
      } else {
        riceImage = happyRice;
        avatarName = riceProfiles[3].avatar
        resultMessage = riceProfiles[3].message
      }

    return(
        <div className="flex flex-col items-center justify-center">
            <div className="flex">
            <Image src={riceImage} alt="sad Rice" width={150} height={150} />
        
                <div className="flex flex-col items-center justify-center">
                    <h1>Your Score</h1>
                    <h2>{score}</h2>
                    <p>You're {avatarName}!</p>
                    <p>{resultMessage}</p>
                </div>
            </div>
            <a href="/"><button>Take Again!</button></a>
            <p>Thanks for your submission!</p>
            <p>The UCRPurity Test was created by the Purified Rice Team</p>
        </div>
    )
}