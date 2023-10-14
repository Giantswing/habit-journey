import React, { useEffect, useRef } from "react";
import Label from "./Label";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import NewFilterList from "./NewFilterList";
import useTimeout from "../utils/useTimeout";

import { AiOutlineClose, AiFillDelete } from "react-icons/ai";

export default function NewHabitModal() {
  const { score, habits, setHabits, currentHabitType, filters, setShowHabitModal, showHabitModal, editMode, setHabitToEdit, habitToEdit, setEditMode } =
    useAuthContext();

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

  function addNewHabit() {
    //Verify if the habit is valid
    var anyError = false;
    var errorMsg = [];

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
    var newHabitToAdd = { ...newHabit, type: currentHabitType };

    if (editMode) {
      setHabits((prevHabits) => {
        return prevHabits.map((habit) => {
          if (habit.id === newHabit.id) {
            habit = newHabit;
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
    setShowHabitModal(false);
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
    resetNewHabit();
  }, [showHabitModal]);

  useEffect(() => {
    if (editMode && habitToEdit) {
      setNewHabit(habitToEdit);
      setSelectedModalFilters({
        positive: habitToEdit.category,
        negative: habitToEdit.category,
      });
    } else {
      resetNewHabit();
    }
  }, [editMode, habitToEdit]);

  return (
    <>
      <section
        className={`p-5 mb-4 border-2
    ${showHabitModal ? "scale-100" : "scale-0"}
    
     fixed max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[97%] bg-white rounded-md shadow-lg z-50 transtion-transform ease-out-expo duration-100
    `}
      >
        <h2
          className={`pb-3 mb-4 border-b font-semibold ${
            currentHabitType == "positive" ? "border-green-700 text-green-700" : "border-red-700 text-red-700"
          } text-center`}
        >
          {editMode ? "Edit" : "Add new"} {currentHabitType} habit
        </h2>
        <button
          onClick={() => {
            closeModal();
          }}
          className="absolute top-4 right-4 text-slate-600"
        >
          <AiOutlineClose className="text-xl" />
        </button>

        <button
          onClick={() => {
            const updatedHabits = habits.filter((habit) => habit.id !== newHabit.id);
            setHabits(updatedHabits);
            closeModal();
          }}
          className={`absolute top-4 left-4 text-red-600 ${editMode ? "" : "hidden"}`}
        >
          <AiFillDelete className="text-xl" />
        </button>

        <div className="flex flex-col gap-3">
          <Label name="title" type="text" setNewHabit={setNewHabit} newHabit={newHabit} />

          <div className="flex gap-4">
            <Label type="number" name="cost" setNewHabit={setNewHabit} newHabit={newHabit} />
            <Label type="number" name="duration" tip="in minutes" setNewHabit={setNewHabit} newHabit={newHabit} />
          </div>

          <div>
            <label className="block mb-2 text-xs">Habit category</label>
            {/* <FilterList mode="modal" newHabit={newHabit} setNewHabit={setNewHabit} /> */}
            <NewFilterList getter={filters} selected={selectedModalFilters} setSelected={setSelectedModalFilters} />
          </div>

          <div className={`transition-all p-3 border-slate-300 ${!newHabit.unlimited ? "border-4" : "border-t"}`}>
            <div className={`flex items-center justify-center w-full gap-3 p-2 mb-4 -mt-8 text-center bg-white border-2`}>
              <button
                onClick={() => setNewHabit({ ...newHabit, unlimited: !newHabit.unlimited })}
                className={`w-8 h-5 duration-150 border-2 border-gray-600 rounded-md appearance-none active:scale-50 ${
                  newHabit.unlimited ? "bg-slate-600 border-transparent" : "bg-white"
                }`}
              ></button>

              <label htmlFor="unlimited" className="text-md">
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

        <button onClick={addNewHabit} className="w-full px-4 py-2 mt-5 text-white rounded-md bg-slate-800">
          {editMode ? "Edit" : "Add"} {currentHabitType} habit
        </button>
      </section>

      <div
        onClick={() => {
          closeModal();
        }}
        className={`duration-300 fixed z-40 top-0 left-0 w-full h-full bg-black  ${
          showHabitModal ? "block bg-opacity-50 pointer-events-auto" : "bg-opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
}
