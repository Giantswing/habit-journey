import { useState, useEffect } from "react";
import Link from "next/link";

export default function ToggleMultiple({ getter, setter, values }) {
  const [currentIndex, setCurrentIndex] = useState(Object.keys(values).indexOf(getter));
  const [resultingClassNames, setResultingClassNames] = useState(getToggleClassNames());

  function getToggleClassNames() {
    var result = "rounded-full ease-out-expo duration-300 -z-40 absolute top-0 h-full active:brightness-50 ";
    result += "bg-pale-700 dark:bg-pale-900";

    //move the toggle depending on what value is selected
    const index = currentIndex;
    const amount = Object.keys(values).length;
    const width = parseInt(100 / amount);

    // const left = width * index;
    // result += ` w-${width} left-${left}`;

    if (amount == 2) {
      if (index == 0) {
        result += " w-1/2 left-0";
      } else {
        result += " w-1/2 right-0";
      }
    }

    if (amount == 3) {
      if (index == 0) {
        result += " w-1/3 left-0";
      } else if (index == 1) {
        result += " w-1/3 left-1/3";
      } else {
        result += " w-1/3 left-2/3";
      }
    }

    return result;
  }

  useEffect(() => {
    setResultingClassNames(getToggleClassNames());
  }, [currentIndex]);

  return (
    <div
      className={`relative w-full overflow-hidden border rounded-full 
     border-pale-400`}
    >
      <div className="z-50 flex justify-between w-full h-full ">
        {Object.keys(values).map((key) => {
          return (
            <Link
              key={key}
              className={`text-center duration-100 w-full ${getter == key ? "font-semibold text-white shadow-sm" : ""} p-2 dark:text-white`}
              href={`/?lang=${key}&settings=true`}
              as={`/${key}?settings=true`}
              onClick={() => {
                setter(key);
                setCurrentIndex(Object.keys(values).indexOf(key));
              }}
            >
              {values[key]}
            </Link>
          );
        })}
      </div>
      <div className="">
        <div className={resultingClassNames}></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-50 bg-pale-100 dark:bg-pale-700"></div>
    </div>
  );
}
