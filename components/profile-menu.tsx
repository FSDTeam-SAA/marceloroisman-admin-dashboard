"use client"

import { useState } from "react"
import type { User } from "@/auth/config"
import ChangePasswordModal from "./change-password-modal"

interface ProfileMenuProps {
  user?: User
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowPasswordModal(true)}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{user?.fullName || "User"}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <img
          src={user?.avatar?.url || "/placeholder.svg?height=40&width=40&query=user+avatar"}
          alt={user?.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  )
}
