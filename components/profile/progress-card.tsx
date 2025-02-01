import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressCardProps {
  title: string
  description: string
  progress: number
  currentStep?: number
  totalSteps?: number
  className?: string
  children?: React.ReactNode
}

export function ProgressCard({
  title,
  description,
  progress,
  currentStep,
  totalSteps,
  className,
  children
}: ProgressCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          {currentStep && totalSteps && (
            <span className="text-sm font-normal text-muted-foreground">
              {currentStep}/{totalSteps} Adım
            </span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>İlerleme</span>
            <span>%{Math.round(progress)}</span>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
