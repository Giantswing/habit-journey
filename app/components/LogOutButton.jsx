import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import React from "react";

function LogOutButton() {
  const router = useRouter();
  return (
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
  );
}

export default LogOutButton;
