import {
  Activity,
  Users,
  Flame,
  ShieldAlert,
  GitCommit,
  Car,
  Clock,
  UsersRound,
  PackageX,
  BoxSelect,
  Truck,
  HardHat,
} from 'lucide-react'

export const getAnalyticUI = (slug: string) => {
  const map: Record<string, any> = {
    'movimento-inteligente': { icon: Activity, color: 'text-green-500' },
    'contagem-pessoas': { icon: Users, color: 'text-blue-500' },
    heatmap: { icon: Flame, color: 'text-orange-500' },
    intrusao: { icon: ShieldAlert, color: 'text-red-500' },
    'linha-virtual': { icon: GitCommit, color: 'text-purple-500' },
    lpr: { icon: Car, color: 'text-cyan-500' },
    permanencia: { icon: Clock, color: 'text-yellow-500' },
    aglomeracao: { icon: UsersRound, color: 'text-pink-500' },
    'objeto-abandonado': { icon: PackageX, color: 'text-indigo-500' },
    'remocao-objeto': { icon: BoxSelect, color: 'text-teal-500' },
    'classificacao-veiculos': { icon: Truck, color: 'text-emerald-500' },
    'deteccao-epi': { icon: HardHat, color: 'text-amber-500' },
  }
  return map[slug] || { icon: Activity, color: 'text-primary' }
}
