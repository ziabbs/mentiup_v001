import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-colors hover:bg-accent",
          isSelected && "border-primary bg-primary/10"
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick?.()
          }
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold">{title}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}
