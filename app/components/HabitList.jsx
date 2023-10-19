"use client";

import { useAuthContext } from "../context/AuthContext";

import Habit from "./Habit";

import useTranslation from "next-translate/useTranslation";
import LoadingIcon from "public/icons/Loading.svg";

export default function HabitList({ isSwitching }) {
  const { t } = useTranslation("common");
  const { habits, currentHabitType, selectedFilters, loading } = useAuthContext();

  const filteredHabits = habits
    .filter((habit) => {
      if (currentHabitType === "positive") return habit.type === "positive";
      else if (currentHabitType === "negative") return habit.type === "negative";
      else return habit;
    })
    .filter((habit) => {
      if (currentHabitType === "positive") {
        if (selectedFilters.positive === "all") return habit;
        else return habit.category === selectedFilters.positive;
      }

      if (currentHabitType === "negative") {
        if (selectedFilters.negative === "all") return habit;
        else return habit.category === selectedFilters.negative;
      }
    });

  return (
    <>
      {loading == 2 ? (
        <div className={`mb-8 ${isSwitching ? "-translate-x-40" : ""} duration-150`}>
          <ul>
            {filteredHabits.length > 0 ? (
              filteredHabits
                .sort((a, b) => {
                  if (a.enabled && !b.enabled) return -1;
                  if (!a.enabled && b.enabled) return 1;
                  return 0;
                })
                .map((habit) => <Habit key={habit.id} habit={habit} />)
            ) : (
              <p className="pr-8 text-left dark:text-white text-md">{t("Home.no-habits")}</p>
            )}
          </ul>
        </div>
      ) : (
        <LoadingIcon className="w-12 h-auto text-white animate-spin" />
      )}
    </>
  );
}
