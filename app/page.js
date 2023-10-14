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
  } = useAuthContext();
  const router = useRouter();

  const [isSwitching, setIsSwitching] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user]);

  if (loading)
    return (
      <main className="p-8">
        <h2 className="text-center">Loading...</h2>
      </main>
    );

  return (
    <main className="relative mb-24">
      <div className="p-4">
        <section className="flex items-center justify-between pb-2 mb-4 border-b">
          <ScoreCounter />

          <button
            className={`
          ${showSideMenu ? "opacity-0" : "opacity-100"}
          `}
            onClick={() => setShowSideMenu(true)}>
            <AiOutlineMenu className="inline-block w-8 h-8 duration-200 hover:opacity-50" />
          </button>
        </section>

        <SideMenu setShowSideMenu={setShowSideMenu} showSideMenu={showSideMenu} />

        <EditFiltersModal />
        <div className="flex items-start gap-3">
          <NewFilterList
            getter={filters}
            selected={selectedFilters}
            setSelected={setSelectedFilters}
            isSwitching={isSwitching}
          />
          <button onClick={() => setShowEditFiltersModal(true)}>
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

      <NewHabitModal />
      <SwitchButton isSwitching={isSwitching} setIsSwitching={setIsSwitching} />
    </main>
  );
}

// .filter((habit) => habit.type === currentHabitType)
