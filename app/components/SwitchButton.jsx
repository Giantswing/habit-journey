import React from "react";

import { useAuthContext } from "../context/AuthContext";

function SwitchButton({ isSwitching, setIsSwitching }) {
  const { currentHabitType, setCurrentHabitType } = useAuthContext();
  return (
    <div className=" duration-100 fixed bottom-0 w-full max-w-lg p-3 bg-white shadow-[0_-15px_50px_rgba(0,0,0,0.2)]">
      <button
        className={`active:scale-95 duration-100 z-20 w-full px-4 py-2 text-md text-center text-white rounded-sm ${
          currentHabitType === "positive" ? "bg-red-700" : "bg-green-700"
        }`}
        onClick={() => {
          setCurrentHabitType(currentHabitType === "positive" ? "negative" : "positive");
          setIsSwitching(true);
          setTimeout(() => {
            setIsSwitching(false);
          }, 150);
        }}
      >
        Switch to {currentHabitType === "positive" ? "Negative" : "Positive"} habits
      </button>
    </div>
  );
}

export default SwitchButton;
