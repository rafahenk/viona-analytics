import { useEffect, useState } from 'react'
import { AnalyticCard } from '@/components/store/AnalyticCard'
import { Input } from '@/components/ui/input'
import { Search, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function AnalyticsStore() {
  const [catalog, setCatalog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    supabase
      .from('analytics_catalog')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCatalog(data || [])
        setLoading(false)
      })
  }, [])

  const filteredCatalog = catalog.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Carregando catálogo de analíticos...
        </div>
      ) : filteredCatalog.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2 border border-dashed rounded-xl border-border/50 bg-card/20">
          <Info className="h-6 w-6 opacity-50" />
          <p>Nenhum módulo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCatalog.map((analytic) => (
            <AnalyticCard key={analytic.id} analytic={analytic} />
          ))}
        </div>
      )}
    </div>
  )
}
