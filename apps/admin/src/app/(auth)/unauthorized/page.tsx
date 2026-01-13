'use client'

import { useAuth } from "@clerk/nextjs";

export default function Page() {
   const {signOut} = useAuth();
  return (
    <div>
      You do not have permission to access this page
      <button onClick={()=> signOut()}>Sign out</button>
    </div>
  )
}
