"use client";

import { useState } from "react";

export default function Filter({ filter, selected, setSelected, currentHabitType, getHabitClassNames }) {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <li
      key={filter.title + filter.type}
      className={`${getHabitClassNames(filter, currentHabitType)}
      duration-150 cursor-pointer px-4 capitalize rounded-full 
      ${currentHabitType != filter.type ? "hidden" : ""}
      ${isPressed ? "!scale-90" : ""} `}
      onClick={() => {
        if (currentHabitType === "positive")
          setSelected({
            ...selected,
            positive: filter.title,
          });
        else if (currentHabitType === "negative")
          setSelected({
            ...selected,
            negative: filter.title,
          });

        setIsPressed(true);
        setTimeout(() => {
          setIsPressed(false);
        }, 150);
      }}
    >
      {filter.title}
    </li>
  );
}
