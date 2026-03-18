import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const data = [
  { time: '08:00', pessoas: 40, veiculos: 24 },
  { time: '10:00', pessoas: 30, veiculos: 13 },
  { time: '12:00', pessoas: 20, veiculos: 98 },
  { time: '14:00', pessoas: 27, veiculos: 39 },
  { time: '16:00', pessoas: 18, veiculos: 48 },
  { time: '18:00', pessoas: 23, veiculos: 38 },
]

export function StatsCharts() {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="py-4">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Tráfego Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={{
            pessoas: { label: 'Pessoas', color: 'hsl(var(--primary))' },
            veiculos: { label: 'Veículos', color: 'hsl(var(--chart-2))' },
          }}
          className="h-[120px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))' }} />
              <Bar
                dataKey="pessoas"
                fill="var(--color-pessoas)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar
                dataKey="veiculos"
                fill="var(--color-veiculos)"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
