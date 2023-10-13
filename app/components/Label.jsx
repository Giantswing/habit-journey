"use client";

import { AiFillLock } from "react-icons/ai";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

function Label({ tip, name, type = "text", setNewHabit, newHabit, disabled = false }) {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  return (
    <div className={`flex flex-col ${disabled ? "opacity-75 cursor-none" : ""}`}>
      <label htmlFor={name} className="block mb-2 text-xs capitalize">
        {name} {tip && <span className="text-xs text-gray-400">({tip})</span>} {disabled && <AiFillLock className="inline-block mb-1 ml-1 text-xs" />}
      </label>
      <input
        disabled={disabled}
        maxLength="30"
        placeholder={`Enter ${name}`}
        onChange={(e) => {
          var newValue = e.target.value;
          if (name === "cost" || name === "duration") if (newValue < 1) newValue = 1;
          if (name === "maxIterations" && newValue <= newHabit.iterations) newValue = newHabit.iterations + 1;
          setNewHabit({ ...newHabit, [name]: newValue });
          // router.push({ search: searchParams.toString() });
        }}
        value={newHabit[name]}
        type={type}
        name={name}
        id={name}
        className="w-full p-2 -mt-2 border rounded-sm border-slate-400 "
      />
    </div>
  );
}

export default Label;
