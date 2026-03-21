import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Link2, Key } from 'lucide-react'
import { useProfile } from '@/hooks/use-profile'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function AddCameraDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const { profile } = useProfile()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleSave = async () => {
    if (!profile?.organization_id || !name) return
    setLoading(true)
    try {
      const { error } = await supabase.from('cameras').insert({
        organization_id: profile.organization_id,
        name,
        connection_url: url,
        status: 'online',
      })
      if (error) throw error
      toast.success('Câmera adicionada com sucesso!')
      setOpen(false)
      setName('')
      setUrl('')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error('Erro ao salvar câmera', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Adicionar Câmera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Câmera</DialogTitle>
          <DialogDescription>
            Conecte uma nova câmera à plataforma via RTSP genérico.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rtsp" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rtsp">
              <Link2 className="h-4 w-4 mr-2" /> RTSP Stream
            </TabsTrigger>
            <TabsTrigger value="hikvision" disabled>
              <Key className="h-4 w-4 mr-2" /> API Nativa (Em breve)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rtsp" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Câmera</Label>
              <Input
                id="name"
                placeholder="ex: Estacionamento Norte"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL RTSP</Label>
              <Input
                id="url"
                placeholder="rtsp://admin:senha@192.168.1.100:554/stream1"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || !name}>
            {loading ? 'Salvando...' : 'Testar Conexão e Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
