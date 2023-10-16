"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./context/AuthContext";
import { PiGearDuotone } from "react-icons/pi";
import { AiOutlineMenu } from "react-icons/ai";

/* Firebase */

/* Components */
import LogOutButton from "./components/LogOutButton";
import NewHabitModal from "./components/NewHabitModal";
import SwitchButton from "./components/SwitchButton";
import ScoreCounter from "./components/ScoreCounter";
import HabitList from "./components/HabitList";
import NewFilterList from "./components/NewFilterList";
import EditFiltersModal from "./components/EditFiltersModal";
import SideMenu from "./components/SideMenu";
import EditScoreModal from "./components/EditScoreModal";

export default function Home() {
  const {
    user,
    loading,
    currentHabitType,
    setEditMode,
    setShowHabitModal,
    filters,
    selectedFilters,
    setSelectedFilters,
    setShowEditFiltersModal,
    darkMode
  } = useAuthContext();
  const router = useRouter();

  const [isSwitching, setIsSwitching] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  // function setDefaultTheme() {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  function detectUserOSDarkMode() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return true;
    } else {
      return false;
    }
  }


  if (loading)
    return (
      <main className={`p-8 ${detectUserOSDarkMode ? "dark" : ""}`}>
        <h2 className={`text-center text-pale-800 dark:text-pale-100 `}>Loading...</h2>
        <div className="fixed inset-0 bg-pale-50 dark:bg-pale-900 z-[-100]  duration-1000 "></div>
      </main>
    );

  return (
    <>
      <main className={`relative mb-24 ${darkMode === undefined && detectUserOSDarkMode} ${darkMode != undefined && darkMode == true ? "dark" : ""}`}>
        <div className="p-4">
          <section className="flex items-center justify-between pb-2 mb-4 border-b border-pale-300 dark:border-pale-600">
            <ScoreCounter />

            <button
              className={`
          ${showSideMenu ? "opacity-0" : "opacity-100"}
          dark:text-pale-50
          `}
              onClick={() => setShowSideMenu(true)}>
              <AiOutlineMenu className="inline-block w-8 h-8 duration-200 hover:opacity-50" />
            </button>
          </section>

          <SideMenu setShowSideMenu={setShowSideMenu} showSideMenu={showSideMenu} />

          <NewHabitModal />
          <EditFiltersModal />
          <EditScoreModal />

          <div className="flex items-start gap-3">
            <NewFilterList
              getter={filters}
              selected={selectedFilters}
              setSelected={setSelectedFilters}
              isSwitching={isSwitching}
            />
            <button onClick={() => setShowEditFiltersModal(true)} className="text-pale-700 dark:text-pale-300">
              <PiGearDuotone className="inline-block w-6 h-6" />
            </button>
          </div>
          <HabitList isSwitching={isSwitching} />

          <button
            className={`w-full p-2 border rounded-md text-md ${currentHabitType === "positive"
              ? "border-green-600 text-green-600"
              : "border-red-500 text-red-500"
              }`}
            onClick={() => {
              setEditMode(false);
              setShowHabitModal(true);
            }}
          >
            Add new {currentHabitType} habit
          </button>
        </div>

        <SwitchButton isSwitching={isSwitching} setIsSwitching={setIsSwitching} />

        <div className="fixed inset-0 bg-pale-50 dark:bg-pale-900 z-[-100]  duration-1000 ">

        </div>
      </main>
    </>
  );
}

// .filter((habit) => habit.type === currentHabitType)
