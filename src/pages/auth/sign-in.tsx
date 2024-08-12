import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

const signInForm = z.object({
  username: z.string().min(1, { message: 'Informe o nome de usuário.' }),
  password: z.string().min(1, { message: 'Informe a senha.' }),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  })

  async function handleSignIn(user: SignInForm) {
    console.log(user)
  }

  return (
    <>
      <Helmet title="Login" />

      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="flex w-[300px] flex-col justify-center gap-6 md:w-[500px]">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar</h1>
            <p className="text-sm text-muted-foreground">
              Olá, seja bem-vindo(a)!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Seu usuário</Label>
              <Input id="username" type="text" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2 pb-8">
              <Label htmlFor="password">Sua senha</Label>
              <PasswordInput id="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Entrar
            </Button>
            <div className="flex flex-row items-center justify-center pb-12">
              <p className="text-sm">Ainda não possui uma conta?</p>
              <Button asChild variant="link">
                <Link to="/sign-up">Nova conta</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
