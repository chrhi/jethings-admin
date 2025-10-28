"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const routes = [
     {
      name: "resources",
      path: "/resources"
    },
    {
      name: "actions",
      path: "/actions"
    },
   
    {
      name: "policies",
      path: "/policies"
    },
    {
      name: "roles",
      path: "/roles"
    }
  ]

  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full h-[40px] flex items-center justify-start gap-x-1 border-b px-4">
        {routes.map(item => {
          const isActive = pathname === item.path
          return (
            <Link key={item.path} href={item.path}>
              <Button 
                variant="ghost" 
                className={`relative capitalize rounded-none h-[40px] px-6 hover:bg-transparent ${
                  isActive ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary' : ''
                }`}
              >
                {item.name}
              </Button>
            </Link>
          )
        })}
      </div>
      <div className="px-4">
        {children}
      </div>
    </div>
  )
}