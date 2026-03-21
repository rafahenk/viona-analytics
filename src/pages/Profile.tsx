import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Building, Mail, FileText, CheckCircle2 } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    cnpj: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.full_name || '',
        companyName: profile.organizations?.name || '',
        cnpj: profile.organizations?.cnpj || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (profile?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: form.fullName })
          .eq('id', profile.id)

        if (profileError) throw profileError
      }

      if (profile?.organization_id) {
        const { error: orgError } = await supabase
          .from('organizations')
          .update({ name: form.companyName, cnpj: form.cnpj })
          .eq('id', profile.organization_id)

        if (orgError) throw orgError
      }

      toast.success('Perfil atualizado com sucesso!', {
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      })
    } catch (error: any) {
      toast.error('Erro ao atualizar', {
        description: error.message || 'Ocorreu um erro ao salvar os dados.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 h-full">
        <p className="text-muted-foreground">Carregando dados do perfil...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações e as da sua organização
          </p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Dados Cadastrais</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e os dados da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted text-muted-foreground"
                    title="O e-mail não pode ser alterado."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    Nome da Empresa
                  </Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    CNPJ
                  </Label>
                  <Input
                    id="cnpj"
                    value={form.cnpj}
                    onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
