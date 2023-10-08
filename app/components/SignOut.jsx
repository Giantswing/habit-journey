"use client";

import { useSession, signOut } from "next-auth/react";

function SignOut() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <div>
        Signed in as {session.user.email} <br />
        <button
          className="duration-100 hover:font-bold"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }
  return <div>Not signed in</div>;
}

export default SignOut;
