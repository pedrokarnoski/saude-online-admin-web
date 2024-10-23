import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import html2pdf from 'html2pdf.js'
import { HeartPulse } from 'lucide-react'
import { useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getUser } from '@/api/get-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'

const newPrescriptionForm = z.object({
  patient: z.string().min(3, { message: 'Digite o nome do paciente.' }),
  prescription: z.string().min(3, { message: 'Digite a prescrição médica.' }),
})

type NewPrescriptionForm = z.infer<typeof newPrescriptionForm>

export function Prescription() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const prescriptionRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPrescriptionForm>({
    resolver: zodResolver(newPrescriptionForm),
  })

  function handleCreatePrescription(data: NewPrescriptionForm) {
    try {
      const element = prescriptionRef.current

      if (element) {
        const options = {
          margin: 0.8,
          filename: `Receituário ${data.patient}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        }

        html2pdf()
          .from(element)
          .set(options)
          .save()
          .then(() => {
            reset()
            toast({
              variant: 'default',
              title: 'Receituário',
              description: 'Receituário gerado com sucesso.',
            })
          })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Receituário',
        description: 'Erro ao gerar o receituário. Tente novamente.',
      })
    }
  }

  return (
    <>
      <Helmet title="Receituário" />

      <div className="px-4 py-10 md:px-20 2xl:px-80">
        <form
          className="items-center space-y-2"
          onSubmit={handleSubmit(handleCreatePrescription)}
        >
          <div ref={prescriptionRef}>
            <div className="flex flex-row items-center gap-8">
              <HeartPulse className="size-20 text-red-500 lg:size-36" />
              <div className="w-full space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="medic name">Médico</Label>
                  <Input className="h-12" disabled value={user?.name} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="crm">CRM</Label>
                  <Input className="h-12" disabled value="" />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h1 className="text-center text-2xl font-semibold tracking-tight">
                Receituário
              </h1>

              <div className="space-y-1">
                <Label htmlFor="patient">Paciente</Label>
                <Input
                  className="h-12"
                  placeholder="Nome do paciente"
                  {...register('patient')}
                />
              </div>
              {errors.patient && (
                <p className="text-sm text-red-500">{errors.patient.message}</p>
              )}

              <div className="space-y-1">
                <Label htmlFor="patient">Receita</Label>
                <Textarea
                  placeholder="Prescreva o receituário médico"
                  {...register('prescription')}
                />
              </div>
              {errors.prescription && (
                <p className="text-sm text-red-500">
                  {errors.prescription.message}
                </p>
              )}

              <p className="min-w-max font-semibold">
                {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
              </p>
              <div className="flex items-center justify-end pt-20">
                <div className="text-center">
                  <div className="w-80 border-b border-black/50" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-10">
            <Button disabled={isSubmitting} type="submit">
              Imprimir
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
