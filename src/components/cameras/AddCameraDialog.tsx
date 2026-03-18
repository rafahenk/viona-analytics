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

export function AddCameraDialog() {
  const [open, setOpen] = useState(false)

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
            Conecte uma nova câmera à plataforma via RTSP genérico ou credenciais Hikvision.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rtsp" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rtsp">
              <Link2 className="h-4 w-4 mr-2" /> RTSP Stream
            </TabsTrigger>
            <TabsTrigger value="hikvision">
              <Key className="h-4 w-4 mr-2" /> Hikvision ISAPI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rtsp" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Câmera</Label>
              <Input id="name" placeholder="ex: Estacionamento Norte" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL RTSP</Label>
              <Input id="url" placeholder="rtsp://admin:senha@192.168.1.100:554/stream1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização / Grupo</Label>
              <Input id="location" placeholder="Externa" />
            </div>
          </TabsContent>

          <TabsContent value="hikvision" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="h-name">Nome da Câmera</Label>
              <Input id="h-name" placeholder="ex: Recepção" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ip">IP / Hostname</Label>
                <Input id="ip" placeholder="192.168.1.50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Porta HTTP</Label>
                <Input id="port" defaultValue="80" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user">Usuário</Label>
                <Input id="user" defaultValue="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass">Senha</Label>
                <Input id="pass" type="password" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>Testar Conexão e Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
