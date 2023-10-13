import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Filter from "./Filter";

export default function NewFilterList({ getter, selected, setSelected, isSwitching = null }) {
  // Every filter must have:
  //  title(string) type(string) and selected(boolean) properties

  const { currentHabitType } = useAuthContext();

  function getHabitClassNames(currentFilter, currentHabitType) {
    var classReturn = "";

    if (currentHabitType === "positive") {
      if (selected.positive === currentFilter.title) classReturn += "bg-green-600 text-white";
      else classReturn += "border border-green-600 text-green-600 bg-gradient-to-t from-green-100 to-white  ";
    } else if (currentHabitType === "negative") {
      if (selected.negative === currentFilter.title) classReturn += "bg-red-600 text-white";
      else classReturn += "border border-red-600 text-red-600 bg-gradient-to-t from-red-100 to-white";
    }

    return classReturn;
  }

  return (
    <>
      <ul className={`origin-left flex flex-wrap gap-2 ${isSwitching === true ? "-space-x-8 -ml-4 scale-x-90 opacity-50" : ""} duration-150 mb-4`}>
        {getter.map((filter) => {
          return (
            <Filter
              key={filter.title + filter.type}
              filter={filter}
              selected={selected}
              setSelected={setSelected}
              currentHabitType={currentHabitType}
              getHabitClassNames={getHabitClassNames}
            />
          );
        })}
      </ul>
    </>
  );
}
