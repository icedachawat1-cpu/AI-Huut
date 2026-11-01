"use client"

import Image from "next/image"
import { useApp } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Key,
  MessageSquare,
  Beaker,
  User,
  Shield,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "playgrounds", label: "Playgrounds", icon: Beaker },
  { id: "profile", label: "Profile Settings", icon: User },
]

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { currentUser, logout } = useApp()

  return (
    <aside className="w-64 h-screen bg-[#def0e5] border-r border-[#a8d0b8] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#a8d0b8]">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="AI Huuf" width={44} height={44} className="rounded-lg" />
          <div>
            <h1 className="font-bold text-lg text-[#143d24]">AI Huuf</h1>
            <p className="text-xs text-[#3d6b4d]">AI Model Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    currentPage === item.id
                      ? "bg-[#2b5c3a] text-[#f0f7f2]"
                      : "text-[#143d24] hover:bg-[#c8e0d0]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            )
          })}
          
          {/* Admin Control Center - Only for ADMIN */}
          {currentUser?.role === "ADMIN" && (
            <li>
              <button
                onClick={() => onNavigate("admin")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  currentPage === "admin"
                    ? "bg-[#2b5c3a] text-[#f0f7f2]"
                    : "text-[#143d24] hover:bg-[#c8e0d0]"
                )}
              >
                <Shield className="w-5 h-5" />
                Admin Control Center
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-[#a8d0b8]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#2b5c3a]/20 flex items-center justify-center">
            <User className="w-5 h-5 text-[#2b5c3a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#143d24] truncate">
              {currentUser?.displayName}
            </p>
            <p className="text-xs text-[#3d6b4d] truncate">
              {currentUser?.email}
            </p>
          </div>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            currentUser?.role === "ADMIN" 
              ? "bg-[#2b5c3a]/20 text-[#2b5c3a]" 
              : "bg-[#c8e0d0] text-[#143d24]"
          )}>
            {currentUser?.role}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full border-[#b8d8c6] bg-[#e8f3ec] text-[#143d24] hover:bg-[#c53030]/10 hover:text-[#c53030] hover:border-[#c53030]/50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
