"use client"

import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import ChangePasswordModal from "@/components/change-password-modal"

export default function SettingsPage() {
  const { session } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-48">
        <Header />
        <main className="p-8 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your account settings</p>
          </div>

          {/* Profile Section */}
          <Card className="bg-white mb-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <img
                  src={session?.user?.avatar?.url || "/placeholder.svg?height=100&width=100&query=user+avatar"}
                  alt={session?.user?.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900 mb-3">{session?.user?.fullName}</p>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900 mb-3">{session?.user?.email}</p>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold text-gray-900">{session?.user?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-600">Change your password regularly to keep your account secure</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-[#FF6B5B] text-white rounded-lg hover:bg-[#E55A4A] transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </main>
      </div>
    </div>
  )
}
