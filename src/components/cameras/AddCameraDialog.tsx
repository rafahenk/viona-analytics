import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/use-profile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function AddCameraDialog({ onSuccess }: { onSuccess: () => void }) {
  const { profile } = useProfile()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', url: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.organization_id) return

    setLoading(true)
    try {
      const newId = crypto.randomUUID()
      const { error } = await supabase.from('cameras').insert({
        id: newId,
        organization_id: profile.organization_id,
        name: form.name,
        connection_url: form.url,
        status: 'offline',
        is_active: true,
      })

      if (error) throw error

      await supabase.from('audit_logs').insert({
        action: 'Inclusão de câmera',
        entity_type: 'camera',
        user_id: profile?.id,
        details: { organization_id: profile.organization_id, target_name: form.name },
      })

      toast.success('Câmera adicionada com sucesso!')
      setOpen(false)
      setForm({ name: '', url: '' })
      onSuccess()
    } catch (err: any) {
      toast.error('Erro ao adicionar câmera', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Nova Câmera
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Câmera</DialogTitle>
          <DialogDescription>
            Insira os detalhes de conexão RTSP da sua câmera IP.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Câmera</Label>
            <Input
              id="name"
              placeholder="Ex: Câmera Portão Principal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL de Conexão (RTSP)</Label>
            <Input
              id="url"
              placeholder="rtsp://usuario:senha@ip:porta/stream"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Opcional. Pode ser configurado posteriormente.
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar Câmera'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
