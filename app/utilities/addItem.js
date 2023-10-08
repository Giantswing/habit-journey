/* Firebase */
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

const addItem = async (todos, setTodos, newTodo, setNewTodo, userId) => {
  if (newTodo === "") return;
  const updatedTodos = [...todos, newTodo];
  setTodos(updatedTodos);
  setNewTodo("");
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, { todos: updatedTodos });
  console.log("Document written with ID: ", docRef.id);
};

export { addItem };
