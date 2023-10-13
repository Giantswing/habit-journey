"use client";

import { useAuthContext } from "../context/AuthContext";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Image from "next/image";


export default function LoginPage() {
  const router = useRouter();
  const { user, setUser, setScore } = useAuthContext();

  const login = async () => {
    const provider = new GoogleAuthProvider();

    const res = await signInWithPopup(auth, provider).then(async (result) => {
      setUser(result.user);
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return;

      await setDoc(
        docRef,
        {
          name: result.user.displayName,
          email: result.user.email,
        },
        { merge: true }
      );

      if (!docSnap.data().score) {
        await setDoc(docRef, { score: 0 }, { merge: true });
      }

      router.push("/");
    });
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <section className="flex flex-col items-center justify-center px-12 py-8 border rounded-md">
        <Image src="/habit-journey-logo.png" alt="Habit Journey Logo" width={60} height={60} className="mb-5" />
        <h1 className="mb-8 text-xl text-center uppercase">Login to Habit Journey</h1>

        <button className="flex flex-col items-center px-6 py-4 mb-4 text-lg leading-tight duration-100 border border-slate-800 rounded-xl text-slate-800 hover:bg-slate-800 hover:text-white md:flex-row md:gap-4" onClick={login}>
          <FcGoogle className="mb-2 md:mb-0" />
          Login with Google
        </button>
      </section>
    </main>
  );
}
