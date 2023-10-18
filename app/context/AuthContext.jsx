"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { signOut } from "firebase/auth";
import { useRef } from "react";

import { useLocale } from "next-intl";
import { ChangeEvent, useTransition } from "react";
import { usePathname, useRouter } from "next-intl/client";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [habits, setHabits] = useState([]);
  const [currentHabitType, setCurrentHabitType] = useState("positive");
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const decryptKey = useRef(null);
  const [allowSave, setAllowSave] = useState(false);

  const locale = useLocale();
  const pathname = usePathname();
  const [language, setLanguage] = useState(locale);
  const [isPending, startTransition] = useTransition();

  const CryptoJS = require("crypto-js");

  const defaultFilters = [
    {
      title: "all",
      type: "positive",
    },
    {
      title: "all",
      type: "negative",
    },
    {
      title: "sport",
      type: "positive",
    },
    {
      title: "work",
      type: "positive",
    },
    {
      title: "study",
      type: "positive",
    },
    {
      title: "leisure",
      type: "negative",
    },
    {
      title: "junk",
      type: "negative",
    },
  ];
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedFilters, setSelectedFilters] = useState({
    positive: "all",
    negative: "all",
  });

  const [editMode, setEditMode] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  async function loadData({ userId }) {
    if (!userId) {
      // console.log("no user id");
      return;
    }
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    const keyRef = doc(db, "server", "data");
    const keySnap = await getDoc(keyRef);
    const fireKey = keySnap.get("key");
    decryptKey.current = fireKey;

    if (!docSnap.exists()) return;

    //Loading habits
    var tempHabits = docSnap.data().habits;
    if (tempHabits) {
      const decryptedData = await fetch("/api/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: tempHabits,
        }),
      });

      const decryptedHabits = await decryptedData.text();
      tempHabits = JSON.parse(decryptedHabits);

      if (docSnap.data().lastLoginDate !== undefined) {
        var oldDate = docSnap.data().lastLoginDate;
        var newDate = parseInt(new Date().getDate());

        if (oldDate !== newDate) {
          console.log("refreshing habits");
          refreshHabitIterations(tempHabits);
          forceSaveDate(newDate, docRef);
        }
        setLastLoginDate(newDate);
      } else {
        setLastLoginDate(parseInt(new Date().getDate()));
      }

      setHabits(tempHabits);
    }

    if (docSnap.data().score) {
      setScore(docSnap.data().score);
    }

    if (docSnap.data().filters) {
      const decryptedData = await fetch("/api/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: docSnap.data().filters,
        }),
      });

      const decryptedFilters = await decryptedData.text();

      setFilters(JSON.parse(decryptedFilters));
    } else {
      setFilters(defaultFilters);
    }

    if (docSnap.data().theme) {
      setDarkMode(docSnap.data().theme === "dark");
    } else {
      setDarkMode(false);
    }

    if (docSnap.data().sound !== undefined) {
      setSoundEnabled(docSnap.data().sound);
    } else {
      setSoundEnabled(true);
    }

    if (docSnap.data().language !== undefined) {
      setLanguage(docSnap.data().language);
    } else {
      setLanguage(locale);
    }

    // console.log("loaded data sucessfully", "user id: " + userId);
    // console.log(db);
  }

  function refreshHabitIterations(tempHabits) {
    //map through all habits and set their iterations to 0
    for (var i = 0; i < tempHabits.length; i++) {
      tempHabits[i].iterations = 0;
    }
  }

  //Default to OS theme until user data is loaded
  useEffect(() => {
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTimeout(() => {
      setAllowSave(true);
    }, 3000);
  }, []);

  async function forceSaveDate(newDate = lastLoginDate, docRef) {
    console.log("force saving new date");
    await setDoc(
      docRef,
      {
        lastLoginDate: newDate,
      },
      { merge: true }
    );
  }

  async function saveFilters(newFilters = filters) {
    if (!user || !allowSave) return;
    const docRef = doc(db, "users", user.uid);

    const encryptedResponse = await fetch("/api/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: JSON.stringify(newFilters),
      }),
    });

    const encryptedFilters = await encryptedResponse.text();

    await setDoc(
      docRef,
      {
        filters: encryptedFilters,
      },
      { merge: true }
    );
  }

  async function saveHabits(newHabits = habits) {
    if (!user || !allowSave) return;
    const docRef = doc(db, "users", user.uid);

    const encryptedResponse = await fetch("/api/encrypt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: JSON.stringify(newHabits),
      }),
    });

    const encryptedHabits = await encryptedResponse.text();

    await setDoc(
      docRef,
      {
        habits: encryptedHabits,
      },
      { merge: true }
    );
  }

  async function saveScore(newScore = score) {
    if (!user || !allowSave) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        score: newScore,
      },
      { merge: true }
    );
  }

  async function saveUserData(newTheme = darkMode, newSoundEnabled = soundEnabled, newLanguage = language) {
    if (!user || !allowSave) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        theme: newTheme ? "dark" : "light",
        sound: newSoundEnabled,

        language: newLanguage,
      },
      { merge: true }
    );
  }

  async function logout() {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const nextLocale = language;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }, [language]);

  // Auto saving
  useEffect(() => {
    //console.log("Saving score");
    saveScore();
  }, [score]);

  useEffect(() => {
    //console.log("Saving habits");
    saveHabits();
  }, [habits]);

  useEffect(() => {
    //console.log("Saving filters");
    saveFilters();
  }, [filters]);

  useEffect(() => {
    //console.log("Saving theme " + darkMode);
    saveUserData();
  }, [darkMode, soundEnabled, language]);

  // End auto saving

  // Handle loading the data when users logs in or out
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadData({ userId: user?.uid });
      } else {
        setHabits([]);
        setScore(0);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  // Reload data when language changes
  // useEffect(() => {
  //   if (!allowSave) return;
  //   console.log("forcing reload");
  //   loadData({ userId: user?.uid });
  // }, [language]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        score,
        setScore,
        loadData,
        habits,
        setHabits,
        currentHabitType,
        setCurrentHabitType,
        filters,
        setFilters,

        editMode,
        setEditMode,

        habitToEdit,
        setHabitToEdit,

        selectedFilters,
        setSelectedFilters,
        darkMode,
        setDarkMode,
        soundEnabled,
        setSoundEnabled,

        language,
        setLanguage,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
}
