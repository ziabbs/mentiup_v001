"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
  subcategories?: string[]
}

interface MultiSelectProps {
  options: Option[]
  selected: Option[]
  onChange: (selected: Option[]) => void
  placeholder?: string
  maxSelections?: number
  id?: string
  "aria-label"?: string
  "aria-required"?: boolean
  "aria-describedby"?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Seçiniz...",
  maxSelections = 3,
  id,
  "aria-label": ariaLabel,
  "aria-required": ariaRequired,
  "aria-describedby": ariaDescribedby,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedLabels = selected.map(option => option.label)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (option: Option) => {
    const isSelected = selected.some(s => s.value === option.value)
    if (isSelected) {
      onChange(selected.filter(s => s.value !== option.value))
    } else if (selected.length < maxSelections) {
      onChange([...selected, option])
    }
  }

  const removeOption = (optionToRemove: Option) => {
    onChange(selected.filter(option => option.value !== optionToRemove.value))
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg border border-input bg-transparent",
          "hover:bg-accent/50",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
          "transition-all duration-200 cursor-pointer"
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-label={ariaLabel}
        aria-required={ariaRequired}
        aria-describedby={ariaDescribedby}
      >
        <div className="flex flex-wrap gap-1.5 items-center min-h-[28px]">
          {selected.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400 px-1.5">{placeholder}</span>
          ) : (
            selectedLabels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
              >
                {label}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(selected[index])
                  }}
                  className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg"
          id={`${id}-options`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 text-sm border-b border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Ara..."
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => {
              const isDisabled = selected.length >= maxSelections && !selected.some(s => s.value === option.value)
              return (
                <div
                  key={option.value}
                  onClick={(e) => {
                    if (!isDisabled) {
                      e.stopPropagation()
                      toggleOption(option)
                    }
                  }}
                  aria-disabled={isDisabled}
                  className={cn(
                    "px-2 py-1.5 text-sm cursor-pointer flex items-center justify-between",
                    "transition-colors duration-200",
                    selected.some(s => s.value === option.value)
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
                      : "hover:bg-gray-50 dark:hover:bg-gray-900/50",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  role="option"
                  aria-selected={selected.some(s => s.value === option.value)}
                >
                  <span>{option.label}</span>
                  {selected.some(s => s.value === option.value) && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
