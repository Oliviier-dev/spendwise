"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  LogOut,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
  },
  {
    name: "Budget",
    href: "/budget",
    icon: PiggyBank,
  },
  {
    name: "Saving Goals",
    href: "/savings",
    icon: Target,
  },
]

export function MainSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <div className="flex h-full flex-col gap-2">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold tracking-tight">SpendWise</h1>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start gap-y-1 px-2 text-base font-medium">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            onClick={() => {
              // Handle logout logic
              console.log("Logout clicked")
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </Sidebar>
  )
} 