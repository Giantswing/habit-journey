import { useState } from "react";

export default function Toggle({ getter, setter, firstOption, secondOption, height = 15, type = "gray" }) {
  //   const elementHeight = "h-[" + height + "px]";
  //   const [isPressed, setIsPressed] = useState(false);

  function getToggleClassNames(type) {
    var result = "rounded-full ease-out-expo duration-300 -z-50 absolute top-0  w-1/2 h-full active:brightness-50";

    if (getter) {
      result += " left-1/2 ";
    } else {
      result += " left-0 ";
    }

    // if (!isPressed) {
    //   result += "scale-75";
    // }

    if (type == "gray") {
      result += "bg-slate-700";
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
     border-slate-400`}
    >
      <div className="z-50 flex justify-between w-full h-full ">
        <button
          className={`duration-100 w-full ${getter ? "" : "font-semibold text-white shadow-sm"} p-2`}
          onClick={() => {
            setter(false);

            // setIsPressed(true);
            // setTimeout(() => {
            //   setIsPressed(false);
            // }, 100);
          }}
        >
          {firstOption}
        </button>
        <button
          className={`duration-100 w-full ${!getter ? "" : "font-semibold  text-white shadow-sm"} p-2`}
          onClick={() => {
            setter(true);

            // setIsPressed(true);
            // setTimeout(() => {
            //   setIsPressed(false);
            // }, 100);
          }}
        >
          {secondOption}
        </button>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none ">
        {/* <div
          className={`${isPressed ? " brightness-50" : ""} rounded-full ease-out-expo duration-300 -z-50 absolute top-0  w-1/2  ${
            getter ? " left-1/2 " : "left-0"
          } h-full bg-slate-700`}
        ></div> */}

        <div className={getToggleClassNames(type)}></div>
      </div>
    </div>
  );
}
