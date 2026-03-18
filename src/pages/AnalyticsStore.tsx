import { mockAnalytics } from '@/lib/mock-data'
import { AnalyticCard } from '@/components/store/AnalyticCard'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function AnalyticsStore() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Store</h1>
        <p className="text-muted-foreground max-w-2xl">
          Evolua seu sistema de CFTV. Ative algoritmos de visão computacional sob demanda para
          qualquer câmera cadastrada na plataforma.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar módulos (ex: Placas, Pessoas...)"
          className="pl-10 h-10 bg-card border-border/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockAnalytics.map((analytic) => (
          <AnalyticCard key={analytic.id} analytic={analytic} />
        ))}
      </div>
    </div>
  )
}
