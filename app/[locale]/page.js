"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { PiGearDuotone } from "react-icons/pi";
import { AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";

/* Firebase */

/* Components */
import LogOutButton from "../components/LogOutButton";
import NewHabitModal from "../components/NewHabitModal";
import SwitchButton from "../components/SwitchButton";
import ScoreCounter from "../components/ScoreCounter";
import HabitList from "../components/HabitList";
import NewFilterList from "../components/NewFilterList";
import EditFiltersModal from "../components/EditFiltersModal";
import SideMenu from "../components/SideMenu";
import EditScoreModal from "../components/EditScoreModal";
import { useSearchParams } from "next/navigation";

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');
  const {
    user,
    loading,
    currentHabitType,
    setEditMode,
    filters,
    selectedFilters,
    setSelectedFilters,
    darkMode,
  } = useAuthContext();


  const router = useRouter();
  const data = router.query;

  const [isSwitching, setIsSwitching] = useState(false);

  const searchParams = useSearchParams();
  const showSideMenu = searchParams.get('settings') != undefined;


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

            <Link href={`?settings=true`}
              className={`${showSideMenu ? "opacity-0" : "opacity-100"}
                      dark:text-pale-50`}
            >
              <AiOutlineMenu className="inline-block w-8 h-8 duration-200 hover:opacity-50" />
            </Link>
          </section>

          <SideMenu />

          <NewHabitModal />
          <EditFiltersModal />
          <EditScoreModal />

          <h4 className="mb-2 dark:text-pale-200">{t("filter-by")}:</h4>
          <div className="flex items-start gap-3 mb-4">

            <NewFilterList
              getter={filters}
              selected={selectedFilters}
              setSelected={setSelectedFilters}
              isSwitching={isSwitching}
            />
            <Link href="?filter=true" className="text-pale-700 dark:text-pale-300">
              <PiGearDuotone className="inline-block w-6 h-6" />
            </Link>
          </div>

          <HabitList isSwitching={isSwitching} />

          <button
            className={`w-full p-2 border rounded-md text-md ${currentHabitType === "positive"
              ? "border-green-600 text-green-600"
              : "border-red-500 text-red-500"
              }`}
            onClick={() => {
              setEditMode(false);
              router.push(`?habit=true`);
              // setShowHabitModal(true);
            }}
          >
            {currentHabitType == "positive" ? t('add-positive') : t('add-negative')}
          </button>
        </div>

        <SwitchButton isSwitching={isSwitching} setIsSwitching={setIsSwitching} />

        <div className="fixed inset-0 bg-pale-50 dark:bg-pale-900 z-[-100]  duration-1000 ">

        </div>
      </main>
    </>
  );
}