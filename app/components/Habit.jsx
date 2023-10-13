import React from "react";
import { BiTimeFive } from "react-icons/bi";
import { AiOutlineFilter, AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCoinsDuotone, PiGearDuotone } from "react-icons/pi";
import { useAuthContext } from "../context/AuthContext";

import { useEffect, useState } from "react";
import convertSecondsToTime from "../utils/convertSecondsToTime";

export default function Habit({ id, habit }) {
  const { score, setScore, habits, setHabits, setEditMode, setShowHabitModal, setHabitToEdit, currentHabitType } = useAuthContext();
  const [isEnabled, setIsEnabled] = useState(true);
  const [shouldWait, setShouldWait] = useState(false);

  const [show, setShow] = useState(true);
  const [lastUsed, setLastUsed] = useState(habit.lastUsed);

  const [auxInfo, setAuxInfo] = useState("");
  const [isPressed, setIsPressed] = useState(false);

  //Change score when the habit is pressed
  function changeScore() {
    if (shouldWait || !isEnabled) return;

    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
    }, 100);

    const costValue = Number(habit.cost);

    if (habit.type === "positive") {
      setScore((prevScore) => parseInt(prevScore) + costValue);
    } else {
      setScore((prevScore) => parseInt(prevScore) - costValue);
    }

    habit.lastUsed = Date.now();
    setLastUsed(Date.now());

    //find the habit in the array and update it
    const habitIndex = habits.findIndex((habit) => habit.id === id);
    habits[habitIndex] = habit;
    setHabits([...habits]);
  }

  //Handle the time remaining for the habit to be available again
  useEffect(() => {
    if (lastUsed == null) return;

    const timeDiff = Date.now() - lastUsed;
    const timeRemaining = habit.duration * 1000 - timeDiff;

    if (timeRemaining > 0) {
      setShouldWait(true);
      setTimeout(() => {
        setShouldWait(false);
      }, timeRemaining);
    } else {
      setShouldWait(false);
    }
  }, [lastUsed, habit.duration, currentHabitType]);

  //Update the aux info of the habit
  useEffect(() => {
    var result = "";
    if (shouldWait) {
      result = "Doing...";
    } else if (!isEnabled) {
      result = "Not enough points";
    }
    setAuxInfo(result);
  }, [shouldWait, isEnabled, currentHabitType]);

  //Maintain the enabled/disabled state of the habit based on the habit.enabled property
  useEffect(() => {
    if (!habit.enabled == null) {
      habit.enabled = true;
    }

    setIsEnabled(habit.enabled);
  }, [habit.enabled]);

  //Handles if the negative habit should disable itself because the score is too low to afford it
  useEffect(() => {
    if (habit.type === "positive") return () => {};

    const scoreValue = Number(score);
    const costValue = Number(habit.cost);

    if (scoreValue - costValue < 0 && habit.enabled) {
      habit.enabled = false;
      setHabits([...habits]);
    } else if (scoreValue - costValue >= 0 && !habit.enabled) {
      habit.enabled = true;
      setHabits([...habits]);
    }
  }, [score, habit.cost, habit.type]);

  return (
    <li
      key={id}
      className={`transform rounded-md overflow-hidden bg-gradient-to-t relative p-1 pl-5 mb-3 border before:content-[''] before:w-2  before:h-auto  
      to-white before:absolute before:top-0 before:bottom-0 before:left-0
      ${habit.type === "positive" ? "before:bg-green-600  from-emerald-50 " : "before:bg-red-600 from-red-50"} 
       ${isPressed ? "scale-90 translate-y-1 " : ""} 
       ${!isEnabled ? "opacity-80 saturate-0" : ""}
       ${shouldWait ? "opacity-100 saturate-50 brightness-95" : ""}
       duration-75 first-letter:capitalize border-slate-300`}
    >
      <div
        className={`${shouldWait ? "cursor-wait opacity-70" : "cursor-pointer"} `}
        onClick={() => {
          changeScore();
        }}
      >
        <div className={`mb-1 font-semibold ${habit.type === "positive" ? "text-green-600" : "text-red-600"}`}>{habit.title}</div>
        <div className="flex gap-4">
          <div className={`font-bold flex items-center gap-1 ${habit.type === "positive" ? "text-green-600" : "text-red-600"}`}>
            <PiCoinsDuotone />
            {habit.cost}
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <BiTimeFive />
            {convertSecondsToTime(habit.duration)}
          </div>
          {habit.category !== "all" && (
            <div className="flex items-center gap-1 capitalize text-slate-700">
              <AiOutlineFilter />
              {habit.category}
            </div>
          )}
        </div>
      </div>

      <div
        className={`font-semibold absolute top-1 right-1 px-2  text-xs text-white bg-black rounded-l-xl rounded-tr-sm  bg-opacity-0 ${
          auxInfo == "" ? "" : "bg-opacity-70"
        } ${auxInfo == "Doing..." ? "animate-pulse" : ""} duration-300`}
      >
        <span className="flex items-center gap-2">
          {auxInfo} {auxInfo == "Doing..." && <AiOutlineLoading3Quarters className="inline-block animate-spin" />}
        </span>
      </div>

      <div
        className="absolute bottom-0 text-xl cursor-pointer w-9 text-slate-600 right-1 aspect-square"
        onClick={() => {
          setEditMode(true);
          setShowHabitModal(true);
          setHabitToEdit(habit);
        }}
      >
        <PiGearDuotone className="absolute bottom-1 right-1" />
      </div>
    </li>
  );
}
