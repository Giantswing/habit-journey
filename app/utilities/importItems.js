/* Firebase */
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const importTodos = async (userId, setTodos) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  if (data.todos) {
    setTodos(data.todos);
  }
};

export { importTodos };
