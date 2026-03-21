import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useProfile } from '@/hooks/use-profile'
import { Video, ShieldAlert } from 'lucide-react'

export function CameraAccessTab() {
  const { profile } = useProfile()
  const [operators, setOperators] = useState<any[]>([])
  const [cameras, setCameras] = useState<any[]>([])
  const [access, setAccess] = useState<string[]>([])
  const [selectedOp, setSelectedOp] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.organization_id) return
    const loadInit = async () => {
      setLoading(true)
      const [{ data: ops }, { data: cams }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, username')
          .eq('organization_id', profile.organization_id)
          .eq('role', 'operator'),
        supabase.from('cameras').select('id, name').eq('organization_id', profile.organization_id),
      ])
      setOperators(ops || [])
      setCameras(cams || [])
      setLoading(false)
    }
    loadInit()
  }, [profile])

  useEffect(() => {
    if (!selectedOp) {
      setAccess([])
      return
    }
    const loadAccess = async () => {
      const { data } = await supabase
        .from('camera_access')
        .select('camera_id')
        .eq('user_id', selectedOp)
      setAccess((data || []).map((a) => a.camera_id))
    }
    loadAccess()
  }, [selectedOp])

  const toggleAccess = async (cameraId: string, isGranted: boolean) => {
    if (!selectedOp) return
    try {
      if (isGranted) {
        await supabase.from('camera_access').insert({ user_id: selectedOp, camera_id: cameraId })
        setAccess((prev) => [...prev, cameraId])
        toast.success('Acesso concedido')
      } else {
        await supabase
          .from('camera_access')
          .delete()
          .match({ user_id: selectedOp, camera_id: cameraId })
        setAccess((prev) => prev.filter((id) => id !== cameraId))
        toast.success('Acesso revogado')
      }
    } catch (err) {
      toast.error('Erro ao alterar permissão')
    }
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" /> Permissões de Câmeras
        </CardTitle>
        <CardDescription>
          Selecione um usuário operador para definir quais câmeras ele pode visualizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-md space-y-2">
          <Label>Selecione o Operador</Label>
          <Select value={selectedOp} onValueChange={setSelectedOp}>
            <SelectTrigger>
              <SelectValue placeholder="Escolha um operador..." />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op.id} value={op.id}>
                  {op.full_name} ({op.username})
                </SelectItem>
              ))}
              {operators.length === 0 && (
                <SelectItem value="none" disabled>
                  Nenhum operador cadastrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedOp ? (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h4 className="font-medium text-sm text-muted-foreground">Câmeras Disponíveis</h4>
            {cameras.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma câmera cadastrada.</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cameras.map((cam) => {
                const isGranted = access.includes(cam.id)
                return (
                  <div
                    key={cam.id}
                    className={`flex items-center justify-between p-3 rounded-md border transition-colors ${isGranted ? 'border-primary/40 bg-primary/5' : 'border-border/50 bg-muted/20 hover:bg-muted/40'}`}
                  >
                    <Label
                      htmlFor={`cam-${cam.id}`}
                      className="flex-1 cursor-pointer font-medium text-sm"
                    >
                      {cam.name}
                    </Label>
                    <Switch
                      id={`cam-${cam.id}`}
                      checked={isGranted}
                      onCheckedChange={(c) => toggleAccess(cam.id, c)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center text-muted-foreground mt-4 gap-2 bg-muted/10">
            <ShieldAlert className="h-6 w-6 opacity-50" />
            <p>Selecione um operador acima para gerenciar seus acessos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
