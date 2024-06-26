"use client"

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"> 
        <button onClick={() => signIn()}>Signin</button>
        <button onClick={() => signOut()}>Sign out</button>
        <div>{JSON.stringify(session)}</div>
    </main>
  );
}
