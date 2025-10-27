"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, BarChart3, Users, Package, MessageSquare, Settings } from "lucide-react"
import { useState } from "react"
import LogoutModal from "./logout-modal"
import Image from "next/image"

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/coach-lists", label: "Coach Lists", icon: Users },
  { href: "/subscription", label: "Subscription", icon: Package },
  { href: "/contact-support", label: "Contact Support", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <aside className="w-48 bg-[#FF6B5B] text-white flex flex-col h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-center gap-2">
           <Image src="/logo.png" alt="Logo" width={500} height={500} className="w-[50px] h-[50px]"/>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={() => setShowLogoutModal(false)}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  )
}
