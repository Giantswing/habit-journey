"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./context/AuthContext";

import Link from "next/link";

/* Components */
import NewHabitModal from "./components/NewHabitModal";
import SwitchButton from "./components/SwitchButton";
import ScoreCounter from "./components/ScoreCounter";
import HabitList from "./components/HabitList";
import NewFilterList from "./components/NewFilterList";
import EditFiltersModal from "./components/EditFiltersModal";
import SideMenu from "./components/SideMenu";
import EditScoreModal from "./components/EditScoreModal";
import { useSearchParams } from "next/navigation";

import useTranslation from 'next-translate/useTranslation'

/* Icons */
import MenuIcon from "public/icons/Menu.svg"
import GearIcon from "public/icons/Gear.svg"

export default function Home() {
  const { t, lang } = useTranslation('common');
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

            <Link href={`?lang=${lang}&settings=true`}
              className={`${showSideMenu ? "opacity-0" : "opacity-100"}
                      dark:text-pale-50`}
            >
              <MenuIcon className="w-12 h-auto duration-200 text-pale-500 hover:opacity-50" />
            </Link>
          </section>

          <SideMenu />

          <NewHabitModal />
          <EditFiltersModal />
          <EditScoreModal />

          <h4 className="mb-2 dark:text-pale-200">{t("Home.filter-by")}:</h4>
          <div className="flex items-start gap-3 mb-4">

            <NewFilterList
              getter={filters}
              selected={selectedFilters}
              setSelected={setSelectedFilters}
              isSwitching={isSwitching}
            />
            <Link href={`?lang=${lang}&filter=true`} className="text-pale-700 dark:text-pale-300">
              <GearIcon className="text-lg text-pale-700 dark:text-pale-400" />
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
              router.push(`?lang=${lang}&habit=true`);
            }}
          >
            {currentHabitType == "positive" ? t('Home.add-positive') : t('Home.add-negative')}
          </button>
        </div>

        <SwitchButton isSwitching={isSwitching} setIsSwitching={setIsSwitching} />

        <div className="fixed inset-0 bg-pale-50 dark:bg-pale-900 z-[-100]  duration-1000 ">

        </div>
      </main>
    </>
  );
}