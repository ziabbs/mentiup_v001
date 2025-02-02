import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface MentorshipTypeCardProps {
  title: string
  description: string
  icon: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
}

export function MentorshipTypeCard({
  title,
  description,
  icon,
  isSelected,
  onClick
}: MentorshipTypeCardProps) {
  return (
    <Card
      className={cn(
        "group relative cursor-pointer transition-all duration-300",
        "hover:shadow-2xl hover:shadow-emerald-500/10",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "p-6 backdrop-blur-sm",
        "border-2",
        isSelected 
          ? "border-emerald-500 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/20 dark:to-emerald-900/5" 
          : "border-border hover:border-emerald-500/30 bg-white/50 dark:bg-gray-950/30"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label={`${title} - ${description}${isSelected ? ' (Seçili)' : ''}`}
    >
      {/* Check Circle - Absolute positioned */}
      <div 
        className={cn(
          "absolute top-4 right-4 w-7 h-7 rounded-full transition-all duration-300",
          "flex items-center justify-center",
          isSelected 
            ? "bg-emerald-500 ring-4 ring-emerald-500/20 text-white scale-100" 
            : "border-[1.5px] border-muted-foreground/20 text-muted-foreground/20 scale-90 group-hover:scale-95"
        )}
        aria-hidden="true"
      >
        <Check className="w-4 h-4" strokeWidth={2.5} />
      </div>

      <div className="flex flex-col h-full space-y-4">
        {/* Icon and Title */}
        <div className="flex items-center gap-4">
          <div 
            className={cn(
              "p-3.5 rounded-xl transition-all duration-300 relative",
              isSelected 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-gray-100 dark:bg-gray-800 text-muted-foreground group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30"
            )}
            aria-hidden="true"
          >
            {icon}
            {isSelected && (
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-slow" />
            )}
          </div>
          <h3 className={cn(
            "font-semibold text-md tracking-tight transition-colors duration-300",
            isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"
          )}>
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className={cn(
          "text-sm leading-relaxed",
          isSelected ? "text-emerald-900/80 dark:text-emerald-300/90" : "text-muted-foreground"
        )}>
          {description}
        </p>
      </div>

      {/* Hover gradient effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300",
          "bg-gradient-to-br from-emerald-50/50 via-transparent to-emerald-50/20",
          "dark:from-emerald-500/5 dark:via-transparent dark:to-emerald-500/5",
          "group-hover:opacity-100",
          isSelected && "opacity-0"
        )}
        aria-hidden="true"
      />
    </Card>
  )
}
