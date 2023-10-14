"use client";

import { useAuthContext } from "../context/AuthContext";
import Habit from "./Habit";

export default function HabitList({ isSwitching }) {
  const { habits, currentHabitType, selectedFilters } = useAuthContext();

  return (
    <div className={`mb-8 ${isSwitching ? "-translate-x-40" : ""} duration-150`}>
      <ul>
        {habits &&
          habits
            .sort((a, b) => {
              if (a.enabled && !b.enabled) return -1;
              if (!a.enabled && b.enabled) return 1;
              return 0;
            })
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
            })
            .map((habit) => <Habit key={habit.id} habit={habit} />)}
      </ul>
    </div>
  );
}
