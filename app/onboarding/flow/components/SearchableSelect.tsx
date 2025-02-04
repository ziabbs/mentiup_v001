import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Option {
  id: string
  title: string
  description?: string
}

interface SearchableSelectProps {
  options: Option[]
  maxSelections?: number
  onSelect: (selectedOptions: Option[]) => void
  placeholder?: string
  className?: string
}

export function SearchableSelect({
  options,
  maxSelections = 3,
  onSelect,
  placeholder = 'Aramak istediğiniz alanı yazın...',
  className
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.length >= 3) {
      const filtered = options.filter(option =>
        option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
      setIsOpen(true)
    } else {
      setFilteredOptions([])
      setIsOpen(false)
    }
  }, [searchTerm, options])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: Option) => {
    if (selectedOptions.find(selected => selected.id === option.id)) {
      const updated = selectedOptions.filter(selected => selected.id !== option.id)
      setSelectedOptions(updated)
      onSelect(updated)
    } else if (selectedOptions.length < maxSelections) {
      const updated = [...selectedOptions, option]
      setSelectedOptions(updated)
      onSelect(updated)
    }
    setSearchTerm('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      {/* Selected options */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedOptions.map(option => (
          <div
            key={option.id}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
            role="button"
            onClick={() => handleSelect(option)}
          >
            <Check className="w-4 h-4" />
            {option.title}
          </div>
        ))}
      </div>

      {/* Search input */}
      <Input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={selectedOptions.length < maxSelections ? placeholder : `En fazla ${maxSelections} seçim yapabilirsiniz`}
        disabled={selectedOptions.length >= maxSelections}
        className="w-full"
        aria-label="Alan ara"
      />

      {/* Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          {filteredOptions.map(option => (
            <div
              key={option.id}
              className={cn(
                'px-4 py-2 cursor-pointer hover:bg-muted transition-colors',
                selectedOptions.find(selected => selected.id === option.id) && 'bg-primary/10'
              )}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={selectedOptions.find(selected => selected.id === option.id) !== undefined}
            >
              <div className="font-medium">{option.title}</div>
              {option.description && (
                <div className="text-sm text-muted-foreground">{option.description}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
