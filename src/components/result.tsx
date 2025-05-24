import Image from "next/image"
import sadRice from "@/public/sadRice.svg";
import neutralRice from "@/public/neutralRice.svg";
import happyRice from "@/public/happyRice.svg";
import sillyRice from "@/public/sillyRice.svg";

export default function Result({ score }) {

    const messageArray = [
        "Maybe you've done enough college..",
        "Living college to the fullest!",
        "You've had your fair share of UCR!",
        "Get out and do more!",
    ];

    const avatarNames = [
        "Dirty Rice Grain",
        "Average Rice Grain",
        "Silly Rice Grain",
        "Pure Rice Grain",
    ];

    let riceImage;
    let resultMessage;

    if (score >= 0 && score <= 25) {
        riceImage = sadRice;
        resultMessage = messageArray[0]
      } else if (score > 25 && score <= 50) {
        riceImage = neutralRice;
        resultMessage = messageArray[1]
      } else if (score > 50 && score <= 75) {
        riceImage = sillyRice;
        resultMessage = messageArray[2]
      } else {
        riceImage = happyRice;
        resultMessage = messageArray[3]
      }

    return(
        <div className="flex flex-col items-center justify-center">
            <div className="flex">
            <Image src={riceImage} alt="sad Rice" width={150} height={150} />
        
                <div className="flex flex-col items-center justify-center">
                    <h1>Your Score</h1>
                    <h2>{score}</h2>
                    <p>You're a Pure Rice Grain!</p>
                    <p>{resultMessage}</p>
                </div>
            </div>
            <a href="/"><button>Take Again!</button></a>
            <p>Thanks for your submission!</p>
            <p>The UCRPurity Test was created by the Purified Rice Team</p>
        </div>
    )
}