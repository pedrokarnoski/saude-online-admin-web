import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import html2pdf from 'html2pdf.js'
import { Check, HeartPulse, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getPatients } from '@/api/get-patients'
import { getUser, PatientProps } from '@/api/get-user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

const newPrescriptionForm = z.object({
  patientId: z.string().min(1, 'Selecione um paciente.'),
  prescription: z.string().min(3, { message: 'Digite a prescrição médica.' }),
})

type NewPrescriptionForm = z.infer<typeof newPrescriptionForm>

export function Prescription() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: Infinity,
  })

  const prescriptionRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewPrescriptionForm>({
    resolver: zodResolver(newPrescriptionForm),
  })

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [selectedPatient, setSelectedPatient] = useState<PatientProps>()

  const handlePatientSelect = (patient: PatientProps) => {
    setSelectedPatient(patient)
    setValue('patientId', patient.id)
    setIsPopoverOpen(false)
  }

  function handleCreatePrescription(data: NewPrescriptionForm) {
    try {
      const element = prescriptionRef.current

      if (element) {
        const options = {
          margin: 0.8,
          filename: `Receituário ${data.patientId}.pdf`,
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

      <div className="md:px-20 2xl:px-80">
        <div className="mb-8 flex items-center gap-3">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Nova receita
          </h1>
        </div>
        <Card className="p-8">
          <form
            className="items-center space-y-2"
            onSubmit={handleSubmit(handleCreatePrescription)}
          >
            <div ref={prescriptionRef}>
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-row items-center gap-8 text-center">
                  <HeartPulse className="size-20 text-red-500 lg:size-36" />
                  <div className="w-full space-y-2">
                    <div className="flex flex-col space-y-4">
                      <Label className="text-2xl" htmlFor="clinicName">
                        Clínica Saúde Online
                      </Label>
                      <Label
                        className="text-muted-foreground"
                        htmlFor="clinicAddress"
                      >
                        Rua da Prescrição n°1 Bairro Receita, Guarapuava/PR
                      </Label>
                      <Label
                        className="text-muted-foreground"
                        htmlFor="clinicInfos"
                      >
                        CEP 00000-000 | Telefone (42) 99999-9999 | CNPJ
                        00.000.000/0000-00
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="my-8">
                  <Label className="text-xl" htmlFor="clinic name">
                    {user?.name}
                  </Label>
                </div>

                <div>
                  <Popover
                    open={isPopoverOpen}
                    onOpenChange={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <PopoverTrigger asChild>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="patient-select" className="font-medium">
                          Paciente
                        </Label>
                        <Button
                          id="patient-select"
                          type="button"
                          size="lg"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <UserRound className="mr-2 h-4 w-4 text-primary" />
                          {selectedPatient ? (
                            selectedPatient.name
                          ) : (
                            <span className="text-muted-foreground">
                              Selecione o paciente
                            </span>
                          )}
                        </Button>
                        {errors.patientId && (
                          <p className="text-sm text-destructive">
                            {errors.patientId.message}
                          </p>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-2">
                      <Command>
                        <CommandInput placeholder="Buscar paciente..." />
                        <CommandList>
                          <CommandEmpty>
                            Nenhum paciente encontrado
                          </CommandEmpty>
                          <CommandGroup>
                            {patients?.map((patient) => (
                              <CommandItem
                                key={patient.id}
                                value={patient.name}
                                onSelect={() => handlePatientSelect(patient)}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    patient.id === selectedPatient?.id
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {patient.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

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
                    {/* Linha para assinatura */}
                    <div className="w-80 border-b border-black/50" />
                    {/* Nome do médico abaixo da linha */}
                    <p className="mt-2 text-sm font-semibold">{user?.name}</p>
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
        </Card>
      </div>
    </>
  )
}
