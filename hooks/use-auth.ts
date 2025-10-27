"use client"

import { useSession, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const logout = async () => {
    await signOut({ redirect: false })
  }

  return {
    session: session as any,
    loading: status === "loading",
    logout,
    isAuthenticated: status === "authenticated",
  }
}
