"use client"

import { signOut } from "next-auth/react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LogoutModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function LogoutModal({ isOpen, onConfirm, onCancel }: LogoutModalProps) {
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/login" })
      onConfirm()
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogTitle>Logout</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to logout? You will need to login again to access the dashboard.
        </AlertDialogDescription>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="bg-[#FF6B5B] hover:bg-[#E55A4A]">
            Yes
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
