"use client";

import { AiFillLock } from "react-icons/ai";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

function Label({ tip, name, displayName = name, displayDefault = name, type = "text", setNewHabit, newHabit, disabled = false }) {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  return (
    <div className={`flex flex-col ${disabled ? "opacity-75 cursor-none" : ""}`}>
      <label htmlFor={name} className="block mb-2 text-xs capitalize dark:text-pale-100">
        {displayName} {tip && <span className="text-xs text-pale-400 dark:text-pale-50">({tip})</span>}{" "}
        {disabled && <AiFillLock className="inline-block mb-1 ml-1 text-xs" />}
      </label>
      <input
        disabled={disabled}
        maxLength="30"
        placeholder={displayDefault}
        onChange={(e) => {
          var newValue = e.target.value;
          if (name === "cost" || name === "duration") if (newValue < 0) newValue = 0;
          // if (name === "maxIterations" && newValue < newHabit.iterations) newValue = newHabit.iterations;
          setNewHabit({ ...newHabit, [name]: newValue });
          // router.push({ search: searchParams.toString() });
        }}
        value={newHabit[name]}
        type={type}
        name={name}
        id={name}
        className="w-full p-2 -mt-2 border rounded-sm border-pale-400 dark:text-pale-100 dark:bg-pale-800"
      />
    </div>
  );
}

export default Label;
