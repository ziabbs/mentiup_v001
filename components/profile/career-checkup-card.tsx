import { Button } from "@/components/ui/button"
import { ProgressCard } from "./progress-card"
import { BarChart, CheckCircle2 } from "lucide-react"

export function CareerCheckupCard() {
  // TODO: Bu veriler backend'den gelecek
  const mockData = {
    progress: 35,
    currentStep: 2,
    totalSteps: 5,
  }

  return (
    <ProgressCard
      title="Kariyer Check-Up"
      description="Hedeflerinizi belirleyin, size özel yol haritanızı oluşturun."
      progress={mockData.progress}
      currentStep={mockData.currentStep}
      totalSteps={mockData.totalSteps}
    >
      <div className="space-y-4">
        {/* Tamamlanan Adımlar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Temel Bilgiler</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Yetkinlik Değerlendirmesi</span>
          </div>
        </div>

        {/* Grafikler */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <BarChart className="h-4 w-4" />
            <span>Yetkinlik Analizi</span>
          </div>
          <div className="mt-2 text-2xl font-bold">%65</div>
          <div className="text-xs text-muted-foreground">
            Yazılım Geliştirme alanında ortalama üstü performans
          </div>
        </div>

        {/* Aksiyon Butonu */}
        <Button className="w-full">
          {mockData.progress === 100 ? "Sonuçları Görüntüle" : "Devam Et"}
        </Button>
      </div>
    </ProgressCard>
  )
}
