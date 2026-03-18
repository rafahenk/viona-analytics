import { Activity, Cloud, Server } from 'lucide-react'

export function AppFooter() {
  return (
    <footer className="h-8 border-t bg-muted/20 flex items-center px-6 text-xs text-muted-foreground shrink-0 justify-between">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sistema Operacional
        </span>
        <span className="flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          Uso CPU: 24%
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <Server className="h-3 w-3" />
          Edge Nodes: 2 Ativos
        </span>
        <span className="flex items-center gap-1.5">
          <Cloud className="h-3 w-3" />
          Cloud Sync: Sincronizado
        </span>
      </div>
    </footer>
  )
}
