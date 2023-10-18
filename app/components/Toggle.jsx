import { useState } from "react";

export default function Toggle({ getter, setter, firstOption, secondOption, height = 15, type = "gray" }) {
  function getToggleClassNames(type) {
    var result = "rounded-full ease-out-expo duration-300 -z-40 absolute top-0  w-1/2 h-full active:brightness-50";

    if (getter) {
      result += " left-1/2 ";
    } else {
      result += " left-0 ";
    }
    if (type == "gray") {
      result += "bg-pale-700 dark:bg-pale-900";
    }

    if (type == "greenred") {
      if (getter) {
        result += "bg-red-700";
      } else {
        result += "bg-green-700";
      }
    }

    return result;
  }

  return (
    <div
      className={`relative w-full overflow-hidden border rounded-full 
     border-pale-400`}
    >
      <div className="z-50 flex justify-between w-full h-full ">
        <button
          className={`duration-100 w-full ${getter ? "" : "font-semibold text-white shadow-sm"} p-2 dark:text-white`}
          onClick={() => {
            setter(false);
          }}
        >
          {firstOption}
        </button>
        <button
          className={`duration-100 w-full ${!getter ? "" : "font-semibold  text-white shadow-sm"} p-2 dark:text-white`}
          onClick={() => {
            setter(true);
          }}
        >
          {secondOption}
        </button>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none ">
        <div className={getToggleClassNames(type)}></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-50 bg-pale-100 dark:bg-pale-700"></div>
    </div>
  );
}
