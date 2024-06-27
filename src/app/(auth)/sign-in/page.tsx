'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <div className="flex justify-center items-center  w-full ">
        Not signed in 
        <button className="bg-zinc-700 m-10 px-5 py-[5.5px] rounded-full" onClick={() => signIn()}>Sign in</button>
      </div>
    </>
  )
}