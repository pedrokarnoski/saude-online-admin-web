import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { getSpecialties } from '@/api/get-specialties'
import { signUp } from '@/api/sign-up'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { PasswordInput } from '@/components/ui/password-input'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

const signUpForm = z.object({
  name: z.string().min(3, { message: 'Digite o nome completo.' }),
  crm: z
    .string()
    .min(10, { message: 'O CRM deve ter 10 caracteres.' })
    .refine((value) => !value || /^CRM\/[A-Z]{2} \d{6}$/.test(value), {
      message:
        'O CRM deve seguir o formato "CRM/UF 123456", onde UF é a unidade federativa e 123456 é o número de 6 dígitos.',
    }),
  specialties: z.array(z.string()).refine((val) => val.length > 0, {
    message: 'Por favor, selecione suas especialidades.',
  }),
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
  const navigate = useNavigate()

  const { toast } = useToast()

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  })

  const { data: specialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
    staleTime: Infinity,
  })

  const { mutateAsync: registerUser } = useMutation({
    mutationFn: signUp,
  })

  async function handleSignUp(user: SignUpForm) {
    try {
      await registerUser({
        name: user.name,
        username: user.username,
        password: user.password,
        crm: user.crm,
        role: 'ADMIN',
        specialties: selectedSpecialties,
      })

      toast({
        variant: 'default',
        title: 'Criar conta',
        description: 'Conta criada! Entre agora',
        action: <ToastAction altText="Fazer login">Fazer login</ToastAction>,
        onClick: () => navigate('/sign-in'),
      })

      reset()
      setSelectedSpecialties([])
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)

      toast({
        variant: 'destructive',
        title: 'Criar conta',
        description: errorMessage,
      })
    }
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
              <Label htmlFor="crm">CRM</Label>
              <Input id="crm" type="text" {...register('crm')} />
              {errors.crm && (
                <p className="text-sm text-red-500">{errors.crm.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades</Label>
              <MultiSelect
                options={specialties ?? []}
                onValueChange={(value) => {
                  setSelectedSpecialties(value)

                  setValue('specialties', value)
                }}
                defaultValue={selectedSpecialties}
                placeholder=""
                variant="inverted"
                animation={2}
                maxCount={3}
              />
              {errors.specialties && (
                <p className="text-sm text-red-500">
                  {errors.specialties.message}
                </p>
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
