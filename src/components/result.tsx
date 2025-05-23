import Image from "next/image"
import sadRice from "@/public/sadRice.svg";
import neutralRice from "@/public/neutralRice.svg";
import happyRice from "@/public/happyRice.svg";
import sillyRice from "@/public/sillyRice.svg";

export default function Result({ score }) {
    let riceImage;
    if (score >= 0 && score <= 25) {
        riceImage = sadRice;
      } else if (score > 25 && score <= 50) {
        riceImage = neutralRice;
      } else if (score > 50 && score <= 75) {
        riceImage = sillyRice;
      } else {
        riceImage = happyRice;
      }
    return(
        <div className="flex flex-col items-center justify-center">
            <div className="flex">
            <Image src={riceImage} alt="sad Rice" width={150} height={150} />
        
                <div className="flex flex-col items-center justify-center">
                    <h1>Your Score</h1>
                    <h2>{score}</h2>
                    <p>You're a Pure Rice Grain!</p>
                    <p>get out and do more!</p>
                </div>
            </div>
            <a href="/"><button>Take Again!</button></a>
            <p>Thanks for your submission!</p>
            <p>The UCRPurity Test was created by the Purified Rice Team</p>
        </div>
    )
}