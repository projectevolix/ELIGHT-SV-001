"use client"

import { useState } from "react"
import { DropdownProps } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleCalendarChange = (value: string) => {
    // Create a synthetic event that react-day-picker expects
    const synthEvent = {
      target: {
        value: value,
      },
    } as React.ChangeEvent<HTMLSelectElement>
    return synthEvent
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border p-2"
        classNames={{
          caption_label: "mx-0",
        }}
        captionLayout="dropdown"
        defaultMonth={new Date()}
        fromYear={1980}
        toYear={new Date().getFullYear()}
        components={{
          Dropdown: (props: DropdownProps) => {
            const handleChange = (value: string) => {
              if (props.onChange) {
                const synthEvent = {
                  target: {
                    value: value,
                  },
                } as React.ChangeEvent<HTMLSelectElement>
                props.onChange(synthEvent)
              }
            }

            return (
              <Select
                value={String(props.value)}
                onValueChange={handleChange}
              >
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {(props as any).options?.map((option: any) => (
                    <SelectItem
                      key={option.value}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          },
        }}
      />
      <p
        className="mt-4 text-center text-xs text-muted-foreground"
        role="region"
        aria-live="polite"
      >
        Monthly / yearly selects -{" "}
        <a
          className="underline hover:text-foreground"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener nofollow"
        >
          React DayPicker
        </a>
      </p>
    </div>
  )
}
