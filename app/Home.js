"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { addItem } from "./utilities/addItem";
import { importTodos } from "./utilities/importItems";

export default function Home() {
  const { user, loading } = useAuthContext();
  const userId = user?.uid;
  const router = useRouter();

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    cost: 0,
    iterations: 0,
    maxIterations: 0,
    duration: 0,
    category: "",
    unlimited: false,
  });

  useEffect(() => {
    // Redirect if the user is not logged in
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    // Import the user's list of todos after logging in
    if (!userId) return;
    importTodos(userId, setTodos);
  }, [userId]);

  if (loading)
    return (
      <main className="p-8">
        <h1 className="mt-4 mb-8 text-4xl text-center uppercase">
          My test TODO app
        </h1>
        <h2 className="text-center">Loading...</h2>
      </main>
    );

  return (
    <main className="p-8">
      <button
        onClick={async () => {
          try {
            await signOut(auth);
            router.push("/login");
          } catch (err) {
            console.log(err);
          }
        }}
        className="mb-4"
      >
        Logout
      </button>
      <h1 className="mt-4 mb-8 text-4xl uppercase">My test TODO app</h1>
      <h2>User ID: {user?.uid}</h2>
      <h2>User Name: {user?.email}</h2>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl uppercase bg-pale-400">TODOs</h2>
        <input
          type="text"
          placeholder="New todo"
          onChange={(e) => setNewTodo?.(e.target.value)}
          value={newTodo}
          className="w-full p-2 mb-4 border-2 border-gray-400 rounded-lg"
        />
        <button
          onClick={() => addItem(todos, setTodos, newTodo, setNewTodo, userId)}
          className="px-4 py-2 mb-4 text-white rounded-lg bg-pale-400"
        >
          Add
        </button>
        {<ul>{todos && todos.map((todo, id) => <li key={id}>{todo}</li>)}</ul>}
      </div>
    </main>
  );
}
