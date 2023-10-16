import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { PiCoinsDuotone, PiGearDuotone } from "react-icons/pi";

export default function ScoreCounter() {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [scoreState, setScoreState] = useState("neutral");
  const { score, soundEnabled, showEditScoreModal, setShowEditScoreModal } = useAuthContext();
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
        if (soundEnabled) audio.play();

        setIterations(0);
      }
    }, 35);
  }, [displayedScore, score]);

  return (
    <button onClick={() => setShowEditScoreModal(true)} className="flex items-center gap-4">
      <div
        className={`flex items-center
     font-bold text-8xl ${scoreState === "positive" && "text-green-500"} ${scoreState === "negative" && "text-red-500"}
      ${scoreState === "neutral" && "text-pale-600 dark:text-pale-300"}
    `}
      >
        {parseInt(displayedScore)}
        <PiCoinsDuotone className="inline-block scale-75" />
      </div>
      <PiGearDuotone className="text-xl text-pale-700 dark:text-pale-400" />
    </button>
  );
}
