import { useQuery } from '@tanstack/react-query'
import { HeartPulse } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getUser } from '@/api/get-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function Prescription() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Receituário" />

      <div className="px-4 py-10 md:px-8 xl:px-80">
        <div className="flex flex-row items-center gap-8">
          <HeartPulse className="size-20 text-red-500 lg:size-36" />
          <div className="w-full space-y-2">
            <div className="space-y-1">
              <Label htmlFor="medic name">Médico</Label>
              <Input disabled value={user?.name} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="crm">CRM</Label>
              <Input disabled value="" />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            Receituário
          </h1>

          <div className="space-y-1">
            <Label htmlFor="patient">Paciente</Label>
            <Input placeholder="Nome do paciente" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="patient">Receita</Label>
            <Textarea placeholder="Prescreva o receituário médico" />
          </div>

          <div className="flex flex-col gap-10 pt-8 lg:flex-row">
            <p className="min-w-max font-semibold">{`${new Date().getDate()} de ${new Date().toLocaleString('default', { month: 'long' })} de ${new Date().getFullYear()}`}</p>
            <div className="flex w-full flex-row gap-2">
              <p>Assinatura:</p>
              <div className="w-full border-b border-black/50" />
            </div>
          </div>
          <div className="flex items-center justify-center py-10">
            <Button>Imprimir</Button>
          </div>
        </div>
      </div>
    </>
  )
}
