"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const Icon = item.icon

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            )}
            
            <div className="flex items-center">
              {Icon && <Icon className="h-4 w-4 mr-1" />}
              
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  isLast ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              )}
            </div>
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Hook to generate breadcrumbs based on pathname
export function useBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  
  // Check if we're in a settings page
  const isSettingsPage = segments[0] === 'settings'
  
  const breadcrumbs: BreadcrumbItem[] = []
  
  // For settings pages, start with Settings instead of Dashboard
  if (isSettingsPage) {
    breadcrumbs.push({
      label: "Settings",
      href: "/settings"
    })
  } else {
    breadcrumbs.push({
      label: "Dashboard",
      href: "/",
      icon: Home
    })
  }

  // Build breadcrumbs based on path segments
  let currentPath = ""
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Skip the first segment if it's empty or just "/"
    if (segment === "") return
    
    // Skip "settings" segment since we already added it as the root
    if (segment === "settings" && isSettingsPage) return
    
    const isLast = index === segments.length - 1
    
    // Generate readable labels
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    })
  })

  return breadcrumbs
}
