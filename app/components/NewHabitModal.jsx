import React, { useEffect, useRef } from "react";
import Label from "./Label";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import NewFilterList from "./NewFilterList";
import { AiOutlineCheck } from "react-icons/ai";
import { useSearchParams, useRouter } from "next/navigation";

import CustomModal from "./CustomModal";

export default function NewHabitModal() {
  const { habits, setHabits, currentHabitType, filters, editMode, setHabitToEdit, habitToEdit, setEditMode } = useAuthContext();

  const [selectedModalFilters, setSelectedModalFilters] = useState({
    positive: "all",
    negative: "all",
  });

  const [newHabit, setNewHabit] = useState({
    id: parseInt(Date.now().toString().slice(-5)),
    title: "",
    cost: "",
    duration: "",
    type: currentHabitType,
    enabled: true,
    lastUsed: Date.now() - 1000 * 60 * 60 * 24 * 7,
    category: "all",
    unlimited: false,
    iterations: 0,
    maxIterations: 2,
  });

  const [auxInfo, setAuxInfo] = useState([]);
  const timeoutId = useRef(null);

  const searchParams = useSearchParams();
  const showHabitModal = searchParams.get("habit") != undefined;
  const router = useRouter();

  function resetNewHabit() {
    setNewHabit({
      id: parseInt(Date.now().toString().slice(-5)),
      title: "",
      cost: "",
      duration: "",
      type: currentHabitType,
      enabled: true,
      lastUsed: Date.now() - 1000 * 60 * 60 * 24 * 7,
      category: "all",
      unlimited: newHabit.unlimited,
      iterations: 0,
      maxIterations: 2,
    });
  }

  function deleteHabit() {
    const updatedHabits = habits.filter((habit) => habit.id !== newHabit.id);
    setHabits(updatedHabits);
    closeModal();
  }

  function addNewHabit() {
    //Verify if the habit is valid
    var anyError = false;
    var errorMsg = [];
    var msg = "";

    if (!newHabit.title || !newHabit.cost || !newHabit.duration) {
      anyError = true;

      errorMsg.push("Please fill all the fields");
    }

    if (!newHabit.unlimited && newHabit.iterations > newHabit.maxIterations) {
      anyError = true;
      errorMsg.push("Iterations can't be greater than max iterations");
    }
    if (!newHabit.unlimited && newHabit.iterations < 0) {
      anyError = true;
      errorMsg.push("Iterations can't be less than 0");
    }
    if (!newHabit.unlimited && newHabit.maxIterations < 1) {
      anyError = true;
      errorMsg.push("Max iterations can't be less than 1");
    }

    if (!newHabit.unlimited && newHabit.maxIterations > 10) {
      anyError = true;
      errorMsg.push("Max iterations can't be greater than 10");
    }

    if (newHabit.cost < 1) {
      anyError = true;
      errorMsg.push("Cost can't be less than 1");
    }

    if (newHabit.duration < 1) {
      anyError = true;
      errorMsg.push("Duration can't be less than 1");
    }

    setAuxInfo(errorMsg);

    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      setAuxInfo([]);
    }, 6000);

    if (anyError) return () => clearTimeout(timeoutId);

    //Add the habit if the habit is valid
    var newHabitToAdd = { ...newHabit, type: currentHabitType, duration: parseInt(newHabit.duration * 60) };

    if (editMode) {
      setHabits((prevHabits) => {
        return prevHabits.map((habit) => {
          if (habit.id === newHabit.id) {
            habit = {
              ...newHabit,
              duration: parseInt(newHabit.duration * 60),
            };
          }
          return habit;
        });
      });
    }

    if (!editMode) {
      setHabits((prevHabits) => {
        return [...prevHabits, newHabitToAdd];
      });
    }

    closeModal();
    resetNewHabit();
  }

  function closeModal() {
    router.push("/");
    setEditMode(false);
    setHabitToEdit(null);
    setSelectedModalFilters({ positive: "all", negative: "all" });
  }

  //update the habit category when the filter is changed
  useEffect(() => {
    if (currentHabitType === "positive") {
      setNewHabit({ ...newHabit, category: selectedModalFilters.positive });
    } else {
      setNewHabit({ ...newHabit, category: selectedModalFilters.negative });
    }
  }, [selectedModalFilters]);

  useEffect(() => {
    if (editMode && habitToEdit) {
      setNewHabit({
        ...habitToEdit,
        duration: habitToEdit.duration / 60,
      });

      setSelectedModalFilters({
        positive: habitToEdit.category,
        negative: habitToEdit.category,
      });
    } else {
      resetNewHabit();
    }
  }, [editMode, habitToEdit, router.asPath]);

  return (
    <CustomModal displayState={showHabitModal} onClose={closeModal} title={editMode ? `Edit ${habitToEdit.title}` : "Add new habit"}>
      <div className="flex flex-col gap-3">
        <Label name="title" type="text" setNewHabit={setNewHabit} newHabit={newHabit} />

        <div className="flex gap-4">
          <Label type="number" name="cost" setNewHabit={setNewHabit} newHabit={newHabit} />
          <Label type="number" name="duration" tip="in minutes" setNewHabit={setNewHabit} newHabit={newHabit} />
        </div>

        <div>
          <label className="block mb-2 text-xs dark:text-pale-50">Habit category</label>
          {/* <FilterList mode="modal" newHabit={newHabit} setNewHabit={setNewHabit} /> */}
          <NewFilterList getter={filters} selected={selectedModalFilters} setSelected={setSelectedModalFilters} />
        </div>

        <div className={`transition-all p-3 border-pale-300 dark:border-pale-900 ${!newHabit.unlimited ? "border-4" : "border-t"}`}>
          <div className={`flex items-center justify-center w-full gap-3 p-2 mb-4 -mt-8 text-center bg-white border-2 dark:bg-pale-700 dark:border-pale-900`}>
            <button
              onClick={() => setNewHabit({ ...newHabit, unlimited: !newHabit.unlimited })}
              className={`relative w-8 h-5 duration-150 border-2 border-gray-600 dark:border-gray-400 rounded-md appearance-none active:scale-50 ${
                newHabit.unlimited ? "bg-pale-600 dark:bg-pale-50 border-transparent" : "bg-white dark:bg-pale-700"
              }`}
            >
              {newHabit.unlimited && <AiOutlineCheck className="w-full text-3xl text-center text-white -translate-y-2 dark:text-pale-900" />}
            </button>

            <label htmlFor="unlimited" className="text-md dark:text-pale-50">
              Unlimited uses per day
            </label>
          </div>
          {!newHabit.unlimited && (
            <div className="flex gap-4">
              <Label disabled={!editMode} type="number" name="iterations" setNewHabit={setNewHabit} newHabit={newHabit} />
              <Label type="number" name="maxIterations" setNewHabit={setNewHabit} newHabit={newHabit} />
            </div>
          )}
        </div>
      </div>

      {auxInfo.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {auxInfo.map((info, index) => (
            <div className="text-xs text-red-600">
              {info}
              {index !== auxInfo.length - 1 && ", "}
            </div>
          ))}
        </div>
      )}

      {editMode && (
        <button onClick={deleteHabit} className="w-full px-4 py-2 mt-4 text-white bg-red-600 rounded-md">
          Delete habit
        </button>
      )}

      <button onClick={addNewHabit} className="w-full px-4 py-2 mt-5 text-white rounded-md bg-pale-800 dark:bg-pale-500">
        {editMode ? "Edit" : "Add"} {currentHabitType} habit
      </button>
    </CustomModal>
  );
}
