"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Command, ArrowRight, Users, Package, Store, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock search data - replace with your actual data
const searchData = [
  {
    id: "1",
    title: "Dashboard",
    description: "Main dashboard overview",
    href: "/",
    icon: Home,
    category: "Overview"
  },
  {
    id: "2", 
    title: "Users",
    description: "Manage user accounts",
    href: "/users",
    icon: Users,
    category: "Users"
  },
  {
    id: "3",
    title: "Admins",
    description: "Manage admin roles",
    href: "/admins", 
    icon: Users,
    category: "Users"
  },
  {
    id: "4",
    title: "Products",
    description: "Manage product catalog",
    href: "/products",
    icon: Package,
    category: "Products"
  },
  {
    id: "5",
    title: "Product Types",
    description: "Manage product categories",
    href: "/product-types",
    icon: Package,
    category: "Products"
  },
  {
    id: "6",
    title: "Stores",
    description: "Manage store locations and approvals",
    href: "/stores",
    icon: Store,
    category: "Products"
  },
  {
    id: "7",
    title: "Settings",
    description: "Application settings",
    href: "/settings",
    icon: Settings,
    category: "Settings"
  }
]

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(searchData)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults(searchData)
      return
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex])

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    return () => document.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  const handleSelect = (item: typeof searchData[0]) => {
    router.push(item.href)
    setOpen(false)
    setQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-search-trigger
          variant="outline"
          className="relative h-8 w-full justify-start rounded-sm bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline-flex">Search...</span>
          <span className="inline-flex lg:hidden">Search</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded-sm border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pages, features, or settings..."
            className="flex h-11 w-full rounded-md !bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 shadow-none focus-visible:ring-0 focus-visible:border-0"
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-1">
              {results.map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                      selectedIndex === index && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelect(item)}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{item.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-50" />
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">↑↓</span> navigate
            </kbd>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">↵</span> select
            </kbd>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <span className="text-xs">esc</span> close
            </kbd>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>Global search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}