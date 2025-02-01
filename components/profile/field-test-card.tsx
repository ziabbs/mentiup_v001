import { Button } from "@/components/ui/button"
import { ProgressCard } from "./progress-card"
import { PieChart, CheckCircle2 } from "lucide-react"

export function FieldTestCard() {
  // TODO: Bu veriler backend'den gelecek
  const mockData = {
    progress: 60,
    currentStep: 3,
    totalSteps: 5,
  }

  return (
    <ProgressCard
      title="Dar-Alan Testi"
      description="Sizin için en uygun uzmanlık alanını keşfedin."
      progress={mockData.progress}
      currentStep={mockData.currentStep}
      totalSteps={mockData.totalSteps}
    >
      <div className="space-y-4">
        {/* Tamamlanan Adımlar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>İlgi Alanları</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Teknik Beceriler</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Çalışma Tercihleri</span>
          </div>
        </div>

        {/* Grafikler */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <PieChart className="h-4 w-4" />
            <span>Alan Uyumluluk Analizi</span>
          </div>
          <div className="mt-2 text-2xl font-bold">3 Alan</div>
          <div className="text-xs text-muted-foreground">
            Backend, DevOps, ve Sistem Mimarisi alanlarında yüksek uyumluluk
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
