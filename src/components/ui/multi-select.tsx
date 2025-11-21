"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export type MultiSelectOption = {
    value: string
    label: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    selected: string[] | string
    onChange: (selected: string[] | string) => void
    className?: string
    placeholder?: string
    mode?: 'single' | 'multi'
    disabled?: boolean
}

export default function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = "Select options...",
    mode = 'multi',
    disabled = false
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    // Normalize selected to array for internal use
    const selectedArray = Array.isArray(selected) ? selected : (selected ? [selected] : [])

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    )

    const toggleSelect = (value: string) => {
        if (mode === 'single') {
            // Single mode: replace selection or clear if same item clicked
            if (selectedArray.includes(value)) {
                onChange('')
            } else {
                onChange(value)
            }
            setOpen(false) // Close popover after selection
        } else {
            // Multi mode: toggle selection
            if (selectedArray.includes(value)) {
                onChange(selectedArray.filter((i) => i !== value))
            } else {
                onChange([...selectedArray, value])
            }
        }
    }

    const handleUnselect = (value: string) => {
        if (mode === 'single') {
            onChange('')
        } else {
            onChange(selectedArray.filter((i) => i !== value))
        }
    }

    return (
        <Popover modal={false} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between min-h-10 h-auto",
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedArray.length > 0 ? (
                            mode === 'single' ? (
                                // Single mode: show single value as text
                                <span className="text-sm">
                                    {options.find(o => o.value === selectedArray[0])?.label}
                                </span>
                            ) : (
                                // Multi mode: show as badges
                                selectedArray.map((value) => {
                                    const opt = options.find((o) => o.value === value)
                                    if (!opt) return null

                                    return (
                                        <Badge
                                            key={value}
                                            variant="secondary"
                                            className="mr-1 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleUnselect(value)
                                            }}
                                        >
                                            {opt.label}
                                            <X className="ml-1 h-3 w-3" />
                                        </Badge>
                                    )
                                })
                            )
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-2 space-y-2 pointer-events-auto z-[9999]"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                {/* Search Input */}
                <input
                    className="w-full px-2 py-1 text-sm border rounded-md"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* List */}
                <ul className="max-h-48 overflow-auto space-y-1">
                    {filteredOptions.length === 0 ? (
                        <li className="text-sm text-muted-foreground px-2 py-1">
                            No results found.
                        </li>
                    ) : (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => toggleSelect(opt.value)}
                                className={cn(
                                    "flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-accent",
                                    selectedArray.includes(opt.value) && "bg-accent"
                                )}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedArray.includes(opt.value)
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {opt.label}
                            </li>
                        ))
                    )}
                </ul>
            </PopoverContent>
        </Popover>
    )
}