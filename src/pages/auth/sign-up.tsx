import { zodResolver } from '@hookform/resolvers/zod'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'

const signUpForm = z.object({
  name: z.string().min(3, { message: 'Digite o nome completo.' }),
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres.' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'O nome de usuário deve conter apenas letras.',
    }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula.',
    })
    .regex(/[0-9]/, { message: 'A senha deve conter pelo menos um número.' }),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  })

  async function handleSignUp(user: SignUpForm) {
    console.log(user)
  }

  return (
    <>
      <Helmet title="Cadastro" />

      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="flex w-[300px] flex-col justify-center gap-6 md:w-[500px]">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Será ótimo tê-lo conosco!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" type="text" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Seu usuário</Label>
              <Input id="username" type="text" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Sua senha</Label>
              <PasswordInput id="password" {...register('password')} />
              {errors.password && (
                <>
                  <p className="text-sm text-red-500">
                    A senha deve ter no mínimo 6 caracteres, conter pelo menos
                    uma letra maiúscula e pelo menos um número.
                  </p>
                </>
              )}
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Finalizar cadastro
            </Button>

            <div className="flex flex-row items-center justify-center pb-12">
              <p className="text-sm">Já possui conta?</p>
              <Button asChild variant="link">
                <Link to="/sign-in">Fazer login</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
