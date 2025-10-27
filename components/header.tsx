"use client"

import { Bell } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import ProfileMenu from "./profile-menu"

export default function Header() {
  const { session } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex-1" />
      <div className="flex items-center gap-6">
        <ProfileMenu user={session?.user} />
      </div>
    </header>
  )
}
