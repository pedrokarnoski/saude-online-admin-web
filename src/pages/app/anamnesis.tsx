import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertCircle, Check, ClipboardList, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getPatients } from '@/api/get-patients'
import type { PatientProps } from '@/api/get-user'
import { registerAnamnesis } from '@/api/register-anamnesis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

const anamnesisSchema = z.object({
  patientId: z.string().min(1, 'Selecione um paciente.'),
  age: z
    .number()
    .int('Idade deve ser um número inteiro.')
    .min(0, 'Idade inválida.')
    .max(120, 'Idade muito alta.'),
  weight: z
    .string()
    .min(1, 'Peso é obrigatório.')
    .regex(/^(\d+(\,\d{1})?|(\,\d{1,2}))$/, 'Peso inválido. Ex: 78,5') // Regex para validar peso em formato decimal
    .transform((value) => value.replace(',', '.')) // Converte vírgula em ponto
    .refine(
      (value) => Number.parseFloat(value) > 0,
      'Peso deve ser maior que zero.',
    ),
  height: z
    .string()
    .min(1, 'Altura é obrigatória.')
    .regex(/^(\d+(\,\d{1,2})?)$/, 'Altura inválida. Ex: 1,80') // Regex para validar altura em formato decimal
    .transform((value) => value.replace(',', '.')) // Converte vírgula em ponto
    .refine(
      (value) => Number.parseFloat(value) > 0 && Number.parseFloat(value) <= 3,
      'Altura deve ser entre 0 e 3 metros.',
    ), // Limita a altura a um valor realista
  symptoms: z.string().min(1, 'Os sintomas são obrigatórios.'),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
})

type AnamnesisFormData = z.infer<typeof anamnesisSchema>

export function Anamnesis() {
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnamnesisFormData>({
    resolver: zodResolver(anamnesisSchema),
  })

  const { mutateAsync: registerAnamnesisFn } = useMutation({
    mutationFn: registerAnamnesis,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['anamnesis'] })
    },
  })

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: Infinity,
  })

  const handleCreateNewAnamnesis = async (data: AnamnesisFormData) => {
    try {
      await registerAnamnesisFn({
        patientId: data.patientId,
        age: data.age,
        weight: data.weight,
        height: data.height,
        symptoms: data.symptoms,
        medicalHistory: data?.medicalHistory,
        allergies: data?.allergies,
      })

      reset()
      setIsPopoverOpen(false)

      toast({
        variant: 'default',
        title: 'Anamnese',
        description: 'Anamnese salva!',
      })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)

      toast({
        variant: 'destructive',
        title: 'Anamnese',
        description: errorMessage,
      })
    }
  }

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [selectedPatient, setSelectedPatient] = useState<PatientProps>()

  const handlePatientSelect = (patient: PatientProps) => {
    setSelectedPatient(patient)
    setValue('patientId', patient.id)
    setIsPopoverOpen(false)
  }

  return (
    <>
      <Helmet title="Nova anamnese" />

      <div className="md:px-20 2xl:px-80">
        <div className="mb-8 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">
            Nova anamnese
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <p>Preencha todos os campos obrigatórios marcados com *</p>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(handleCreateNewAnamnesis)}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Popover
                    open={isPopoverOpen}
                    onOpenChange={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <PopoverTrigger asChild>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="patient-select" className="font-medium">
                          Paciente *
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

                <div className="flex flex-col gap-2">
                  <Label htmlFor="age" className="font-medium">
                    Idade *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 25"
                    {...register('age', { valueAsNumber: true })}
                  />
                  {errors.age && (
                    <p className="text-sm text-destructive">
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age" className="font-medium">
                    Peso *
                  </Label>
                  <Input
                    id="weight"
                    type="string"
                    placeholder="Ex: 78,5"
                    {...register('weight')}
                  />
                  {errors.weight && (
                    <p className="text-sm text-destructive">
                      {errors.weight.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="age" className="font-medium">
                    Altura *
                  </Label>
                  <Input
                    id="height"
                    type="string"
                    placeholder="Ex: 1,80"
                    {...register('height')}
                  />
                  {errors.height && (
                    <p className="text-sm text-destructive">
                      {errors.height.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="symptoms" className="font-medium">
                  Sintomas *
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Descreva detalhadamente os sintomas apresentados pelo paciente"
                  className="min-h-[120px]"
                  {...register('symptoms')}
                />
                {errors.symptoms && (
                  <p className="text-sm text-destructive">
                    {errors.symptoms.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="medicalHistory" className="font-medium">
                  Histórico médico
                </Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Inclua informações relevantes sobre o histórico médico do paciente"
                  className="min-h-[120px]"
                  {...register('medicalHistory')}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="allergies" className="font-medium">
                  Alergias
                </Label>
                <Textarea
                  id="allergies"
                  placeholder="Liste as alergias conhecidas do paciente"
                  {...register('allergies')}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar anamnese'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Anamnesis
