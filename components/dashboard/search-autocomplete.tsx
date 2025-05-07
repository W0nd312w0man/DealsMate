"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Search, Building, User, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  type: "property" | "buyer" | "seller" | "workspace"
  title: string
  subtitle: string
  icon: React.ReactNode
  url: string
}

export function SearchAutocomplete() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Mock search results
  const searchResults: SearchResult[] = [
    {
      id: "p1",
      type: "property",
      title: "15614 Yermo Street",
      subtitle: "Whittier, CA 90603",
      icon: <Building className="h-4 w-4 text-purple-600" />,
      url: "/workspaces/WS-1234",
    },
    {
      id: "p2",
      type: "property",
      title: "456 Oak Avenue",
      subtitle: "Somewhere, CA 90210",
      icon: <Building className="h-4 w-4 text-purple-600" />,
      url: "/workspaces/WS-1235",
    },
    {
      id: "b1",
      type: "buyer",
      title: "Karen Chen",
      subtitle: "Buyer - Active",
      icon: <User className="h-4 w-4 text-blue-600" />,
      url: "/contacts/C-1234",
    },
    {
      id: "s1",
      type: "seller",
      title: "Michael Johnson",
      subtitle: "Seller - Active",
      icon: <User className="h-4 w-4 text-pink-600" />,
      url: "/contacts/C-1235",
    },
    {
      id: "w1",
      type: "workspace",
      title: "Karen Chen Workspace",
      subtitle: "Buyer - Actively Searching",
      icon: <Home className="h-4 w-4 text-green-600" />,
      url: "/workspaces/WS-1234",
    },
  ]

  // Filter results based on query
  const filteredResults =
    query === ""
      ? []
      : searchResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.subtitle.toLowerCase().includes(query.toLowerCase()),
        )

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
        if (!open && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 0)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    router.push(result.url)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground border-purple-200/70 hover:bg-purple-50/50"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
            <span>⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px]" align="start">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Search properties, buyers, sellers..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Properties">
              {filteredResults
                .filter((result) => result.type === "property")
                .map((result) => (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)} className="flex items-center">
                    {result.icon}
                    <div className="ml-2">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="Clients">
              {filteredResults
                .filter((result) => result.type === "buyer" || result.type === "seller")
                .map((result) => (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)} className="flex items-center">
                    {result.icon}
                    <div className="ml-2">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="Workspaces">
              {filteredResults
                .filter((result) => result.type === "workspace")
                .map((result) => (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)} className="flex items-center">
                    {result.icon}
                    <div className="ml-2">
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
