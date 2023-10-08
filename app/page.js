"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

/* Firebase */
import { db } from "../firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";

/* Icons */
import { FcGoogle } from "react-icons/fc";

/* Components */
import SignOut from "./components/SignOut";

/* Functions */
import { addItem } from "./utilities/addItem";
import { importTodos } from "./utilities/importItems";

export default function Home() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const userId = session?.user.id;

  if (!session) {
    // If its not signed in, redirect to signin page
    redirect("/api/auth/signin");
  }

  useEffect(() => {
    importTodos(userId, setTodos);
  }, [userId]);

  return (
    <main className="p-8">
      <h1 className="mt-4 mb-8 text-4xl uppercase">My test TODO app</h1>
      <h2>User ID: {userId}</h2>
      <SignOut />
      <div className="mt-8">
        <h2 className="mb-4 text-2xl uppercase bg-slate-400">TODOs</h2>
        <input
          type="text"
          placeholder="New todo"
          onChange={(e) => setNewTodo?.(e.target.value)}
          value={newTodo}
          className="w-full p-2 mb-4 border-2 border-gray-400 rounded-lg"
        />
        <button
          onClick={() => addItem(todos, setTodos, newTodo, setNewTodo, userId)}
          className="px-4 py-2 mb-4 text-white rounded-lg bg-slate-400"
        >
          Add
        </button>
        <ul>
          {todos.length > 0 &&
            todos.map((todo, id) => <li key={id}>{todo}</li>)}
        </ul>
      </div>
    </main>
  );
}
