import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Aperture, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Login efetuado com sucesso', {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Aperture className="h-10 w-10 text-primary" />
            <span className="font-bold text-3xl tracking-tight">Viona</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground">Entre na sua conta para continuar</p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>Insira seu email e senha ou use uma conta corporativa</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo</Label>
                <Input id="email" type="email" placeholder="nome@empresa.com.br" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 21 21">
                    <path d="M10 0H0v10h10V0z" fill="#f25022" />
                    <path d="M21 0H11v10h10V0z" fill="#7fba00" />
                    <path d="M10 11H0v10h10V11z" fill="#00a4ef" />
                    <path d="M21 11H11v10h10V11z" fill="#ffb900" />
                  </svg>
                  Microsoft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Criar conta agora
          </Link>
        </p>
      </div>
    </div>
  )
}
