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
    selected: string[]
    onChange: (selected: string[]) => void
    className?: string
    placeholder?: string
}

export default function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = "Select options..."
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    )

    const toggleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((i) => i !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const handleUnselect = (value: string) => {
        onChange(selected.filter((i) => i !== value))
    }

    return (
        <Popover modal={false} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    className={cn(
                        "w-full justify-between min-h-10 h-auto",
                        className
                    )}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? (
                            selected.map((value) => {
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
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-3 space-y-2 pointer-events-auto z-[9999]"
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
                                    selected.includes(opt.value) && "bg-accent"
                                )}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.includes(opt.value)
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