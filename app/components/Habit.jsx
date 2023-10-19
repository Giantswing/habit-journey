import React from "react";
import { useAuthContext } from "../context/AuthContext";

import { useEffect, useState } from "react";
import convertSecondsToTime from "../utils/convertSecondsToTime";

import { useSearchParams, useRouter } from "next/navigation";

import useTranslation from "next-translate/useTranslation";

import GearIcon from "public/icons/Gear.svg";
import CoinsIcon from "public/icons/Coins.svg";
import TimeIcon from "public/icons/Time.svg";
import FilterIcon from "public/icons/Filter.svg";
import CircleFullIcon from "public/icons/CircleFull.svg";
import CircleEmptyIcon from "public/icons/CircleEmpty.svg";
import InfiniteIcon from "public/icons/Infinite.svg";
import LoadingIcon from "public/icons/Loading.svg";

export default function Habit({ habit }) {
  const { t } = useTranslation("common");
  const { score, setScore, habits, setHabits, setEditMode, setHabitToEdit, currentHabitType } = useAuthContext();

  const [shouldWait, setShouldWait] = useState(false);
  const [auxInfo, setAuxInfo] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [myHabit, setMyHabit] = useState(habit);

  const searchParams = useSearchParams();
  const showHabitModal = searchParams.get("habit") != undefined;
  const router = useRouter();

  //Change score when the habit is pressed
  function changeScore() {
    if (shouldWait || !myHabit.enabled) return;
    if (!habit.unlimited && habit.iterations >= habit.maxIterations) return;

    if (!habit.unlimited) habit.iterations++;

    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 100);

    const costValue = Number(myHabit.cost);

    if (habit.type === "positive") {
      setScore((prevScore) => parseInt(prevScore) + costValue);
    } else {
      setScore((prevScore) => parseInt(prevScore) - costValue);
    }

    setMyHabit({ ...habit, lastUsed: Date.now(), iterations: habit.iterations });
  }

  //Handle the iterations of the habit
  function displayIterations() {
    if (habit.unlimited || habit.maxIterations === 0) {
      return <InfiniteIcon className="w-6 h-auto" />;
    } else {
      if (habit.maxIterations < 6) {
        var iterations = [];
        for (var i = 0; i < habit.maxIterations; i++) {
          if (i < habit.iterations) {
            iterations.push(<CircleFullIcon key={i} className="w-4 h-auto" />);
          } else {
            iterations.push(<CircleEmptyIcon key={i} className="w-4 h-auto" />);
          }
        }
      } else {
        iterations = `${habit.iterations} / ${habit.maxIterations}`;
      }

      return iterations;
    }
  }

  //Handle the time remaining for the habit to be available again
  useEffect(() => {
    if (myHabit.lastUsed === undefined) return () => {};

    const timeDiff = Date.now() - myHabit.lastUsed;
    const timeRemaining = habit.duration * 1000 - timeDiff;

    if (timeRemaining > 0) {
      setShouldWait(true);
      setTimeout(() => {
        setShouldWait(false);
      }, timeRemaining);
    } else {
      setShouldWait(false);
    }
  }, [myHabit.duration, myHabit.lastUsed, currentHabitType]);

  //Update the habit reference when the habit list changes
  useEffect(() => {
    setMyHabit(habit);
  }, [habit]);

  //Update the aux info of the habit
  useEffect(() => {
    var result = "";
    if (shouldWait) {
      result = t("Habit.doing");
    } else if (!myHabit.enabled) {
      result = t("Habit.disabled");
    } else if (!myHabit.unlimited && myHabit.iterations >= myHabit.maxIterations) {
      result = t("Habit.daily-limit");
    }
    setAuxInfo(result);
  }, [shouldWait, myHabit.enabled, currentHabitType, myHabit.iterations, myHabit.maxIterations]);

  //Update the habit list when the habit is updated
  useEffect(() => {
    const newHabits = habits.map((habit) => {
      if (habit.id === myHabit.id) return myHabit;
      else return habit;
    });

    setHabits(newHabits);
  }, [myHabit]);

  //Handles if the negative habit should disable itself because the score is too low to afford it
  useEffect(() => {
    if (habit.type === "positive") return () => {};

    const scoreValue = Number(score);
    const costValue = Number(habit.cost);

    if (scoreValue - costValue < 0 && habit.enabled) {
      myHabit.enabled = false;
    } else if (scoreValue - costValue >= 0 && !habit.enabled) {
      myHabit.enabled = true;
    }
  }, [score, myHabit.cost, myHabit.type]);

  return (
    <li
      key={myHabit.id}
      className={`transform rounded-md overflow-hidden bg-gradient-to-t relative p-1 pl-5 mb-3 border before:content-[''] before:w-2  before:h-auto  
      to-white dark:to-pale-800 before:absolute before:top-0 before:bottom-0 before:left-0
      ${habit.type === "positive" ? "before:bg-green-600  from-emerald-50 dark:from-emerald-950 " : "before:bg-red-600 from-red-50 dark:from-red-950"} 
       ${isPressed ? "scale-90 translate-y-1 " : ""} 
       ${!myHabit.enabled ? "opacity-80 saturate-0" : ""}
       ${shouldWait ? "opacity-100 saturate-50 brightness-95" : ""}
       duration-75 first-letter:capitalize border-pale-300 dark:border-pale-700`}
    >
      <div
        className={`${shouldWait ? "cursor-wait opacity-70" : "cursor-pointer"} `}
        onClick={() => {
          changeScore();
        }}
      >
        <div className={`mb-1 font-semibold ${habit.type === "positive" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
          {habit.title}
        </div>
        <div className="flex gap-4">
          <div className={`font-bold flex items-center gap-1 ${habit.type === "positive" ? "text-green-600" : "text-red-600"}`}>
            <CoinsIcon className="w-4 h-auto" />
            {habit.cost}
          </div>
          <div className="flex items-center gap-1 text-pale-700 dark:text-pale-50">
            <TimeIcon className="w-4 h-auto" />
            {convertSecondsToTime(habit.duration)}
          </div>
          {habit.category !== "all" && (
            <div className="flex items-center gap-1 capitalize text-pale-700 dark:text-pale-50">
              <FilterIcon className="w-4 h-auto" />
              {habit.category}
            </div>
          )}

          <div
            className={`flex items-center gap-1
          ${habit.type === "positive" ? "text-green-600" : "text-red-600"}`}
          >
            <span className="flex items-center gap-1 font-bold">{displayIterations()}</span>
          </div>
        </div>
      </div>

      <div
        className={`font-semibold absolute top-1 right-1 px-2  text-xs text-white bg-black rounded-l-xl rounded-tr-sm  bg-opacity-0 ${
          auxInfo == "" ? "" : "bg-opacity-70"
        } ${auxInfo == t("Habit.doing") ? "animate-pulse" : ""} duration-300`}
      >
        <span className="flex items-center gap-2">
          {auxInfo} {auxInfo == t("Habit.doing") && <LoadingIcon className="w-4 h-auto animate-spin" />}
        </span>
      </div>

      <div
        className="absolute bottom-0 text-xl cursor-pointer w-9 text-pale-600 dark:text-pale-200 right-1 aspect-square"
        onClick={() => {
          setEditMode(true);
          router.push("?habit=true", { shallow: true, scroll: false });
          setHabitToEdit(habit);
        }}
      >
        <GearIcon className="absolute w-6 h-auto bottom-1 right-1 text-pale-700 dark:text-pale-400" />
      </div>
    </li>
  );
}
