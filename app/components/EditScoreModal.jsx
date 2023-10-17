import CustomModal from "./CustomModal";
import { useAuthContext } from "../context/AuthContext";
import { useState, useEffect } from "react";

import { useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function EditScoreModal() {
  const { score, setScore } = useAuthContext();
  const [newScore, setNewScore] = useState(score);
  const [auxInfo, setAuxInfo] = useState([]);
  const t = useTranslations("EditScoreModal");

  const searchParams = useSearchParams();
  const showEditScoreModal = searchParams.get("score") != undefined;
  const router = useRouter();

  function closeModal() {
    router.push("/");
    setAuxInfo([]);
  }

  useEffect(() => {
    setNewScore(score);
  }, [score]);

  function updateScore() {
    if (newScore < 0) {
      setAuxInfo(["Score can't be negative"]);
      return;
    }

    if (newScore > 1000) {
      setAuxInfo(["Score can't be greater than 1000"]);
      return;
    }

    setScore(newScore);
    closeModal();
  }

  return (
    <CustomModal displayState={showEditScoreModal} onClose={closeModal} title={t("title")}>
      <div className="flex flex-col">
        <label htmlFor="score" className="text-pale-800 dark:text-pale-200">
          {t("score")}
        </label>
        <input
          type="number"
          id="score"
          className="p-2 border-2 rounded-md dark:text-pale-100 border-pale-400 dark:bg-pale-700 dark:border-pale-700"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
        />

        <button onClick={() => updateScore()} className="p-2 mt-4 border-2 rounded-md dark:text-pale-100 border-pale-400 dark:bg-pale-700 dark:border-pale-700">
          {t("update")}
        </button>

        {auxInfo.length > 0 && (
          <div className="flex flex-col mt-4">
            {auxInfo.map((info) => (
              <p key={info} className="text-xs text-red-500">
                {info}
              </p>
            ))}
          </div>
        )}
      </div>
    </CustomModal>
  );
}
