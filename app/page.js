"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./context/AuthContext";

/* Firebase */

/* Components */
import LogOutButton from "./components/LogOutButton";
import NewHabitModal from "./components/NewHabitModal";
import SwitchButton from "./components/SwitchButton";
import ScoreCounter from "./components/ScoreCounter";
import HabitList from "./components/HabitList";
import NewFilterList from "./components/NewFilterList";

export default function Home() {
  const { user, loading, currentHabitType, setEditMode, setShowHabitModal, filters, selectedFilters, setSelectedFilters } = useAuthContext();
  const router = useRouter();

  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(
    () => {
      if (!user && !loading) {
        router.push("/login");
      }
    },
    [user]
  );

  if (loading)
    return (
      <main className="p-8">
        <h2 className="text-center">Loading...</h2>
      </main>
    );

  return (
    <main className="mb-24">
      <div className="p-4">
        <section className="pb-2 mb-4 border-b" >
          <LogOutButton />
          <ScoreCounter />
        </section >

        {/* <section className={`${showHabitModal ? "hidden" : "block"}`}> */}
        <NewFilterList getter={filters} selected={selectedFilters} setSelected={setSelectedFilters} isSwitching={isSwitching} />
        <HabitList isSwitching={isSwitching} />
        {/* </section> */}

        <button className={`w-full p-2 border rounded-md text-md ${currentHabitType === "positive" ? "border-green-600 text-green-600" : "border-red-500 text-red-500"
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
    </main >
  );
}

// .filter((habit) => habit.type === currentHabitType)