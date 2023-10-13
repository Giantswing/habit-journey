import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { PiCoinsDuotone } from "react-icons/pi";

export default function ScoreCounter() {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [scoreState, setScoreState] = useState("neutral");
  const { score } = useAuthContext();
  const audio = new Audio("coin1.ogg");

  var transitionAmount = 1;
  const [iterations, setIterations] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScoreState("neutral");

      var distance = Math.abs(displayedScore - score);
      if (distance > 100) {
        transitionAmount = 5;
      } else if (distance > 50) {
        transitionAmount = 2;
      } else if (distance > 10) {
        transitionAmount = 1;
      } else {
        transitionAmount = 0.5;
      }

      if (displayedScore < score) {
        setDisplayedScore(displayedScore + transitionAmount);
        setScoreState("positive");
        setIterations((prev) => prev + 1);
      } else if (displayedScore > score) {
        setDisplayedScore(displayedScore - transitionAmount);
        setScoreState("negative");
        setIterations((prev) => prev + 1);
      }

      if (iterations >= 2) {
        audio.play();
        setIterations(0);
      }
    }, 35);
  }, [displayedScore, score]);

  return (
    <div
      className={`flex items-center
     font-bold text-6xl ${scoreState === "positive" && "text-green-500"} ${scoreState === "negative" && "text-red-500"}
      ${scoreState === "neutral" && "text-slate-600"}
    `}
    >
      {parseInt(displayedScore)}
      <PiCoinsDuotone className="inline-block scale-75" />
    </div>
  );
}
