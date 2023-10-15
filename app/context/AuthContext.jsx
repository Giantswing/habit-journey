"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [habits, setHabits] = useState([]);
  const [currentHabitType, setCurrentHabitType] = useState("positive");
  const [lastLoginDate, setLastLoginDate] = useState(null);

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

  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showEditFiltersModal, setShowEditFiltersModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  async function loadData({ userId }) {
    if (!userId) return;

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    var tempHabits = docSnap.data().habits;
    if (tempHabits) {
      setHabits(docSnap.data().habits);
    }

    if (docSnap.data().score) {
      setScore(docSnap.data().score);
    }

    if (docSnap.data().filters) {
      setFilters(docSnap.data().filters);
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
      console.log("Sound settings not found, defaulting to true");
      setSoundEnabled(true);
    }

    if (docSnap.data().lastDate !== undefined) {
      var oldDate = docSnap.data().lastDate;
      var newDate = parseInt(new Date().getDate());
      if (oldDate !== newDate) {
        refreshHabitIterations(tempHabits);
      }
      setLastLoginDate(newDate);
    } else {
      setLastLoginDate(parseInt(new Date().getDate()));
    }
  }

  function refreshHabitIterations(tempHabits) {
    //map through all habits and set their iterations to 0
    for (var i = 0; i < tempHabits.length; i++) {
      tempHabits[i].iterations = 0;
    }
    setHabits(tempHabits);
  }

  async function saveData(newScore = score, newHabits = habits, newFilters = filters) {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        score: newScore,
        habits: newHabits,
        filters: newFilters,
      },
      { merge: true }
    );
  }

  async function saveFilters(newFilters = filters) {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        filters: newFilters,
      },
      { merge: true }
    );
  }

  async function saveHabits(newHabits = habits) {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        habits: newHabits,
      },
      { merge: true }
    );
  }

  async function saveScore(newScore = score) {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        score: newScore,
      },
      { merge: true }
    );
  }

  async function saveUserData(newTheme = darkMode, newSoundEnabled = soundEnabled, newDate = lastLoginDate) {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        theme: newTheme ? "dark" : "light",
        sound: newSoundEnabled,
        lastDate: newDate,
      },
      { merge: true }
    );
  }

  async function logout() {
    console.log("Logging out");
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  }

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
  }, [darkMode, soundEnabled, lastLoginDate]);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        score,
        setScore,
        saveData,
        loadData,
        habits,
        setHabits,
        currentHabitType,
        setCurrentHabitType,
        filters,
        setFilters,
        showHabitModal,
        setShowHabitModal,
        editMode,
        setEditMode,
        habitToEdit,
        setHabitToEdit,

        showEditFiltersModal,
        setShowEditFiltersModal,
        selectedFilters,
        setSelectedFilters,

        darkMode,
        setDarkMode,

        soundEnabled,
        setSoundEnabled,

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
