import { useMutation, useQuery } from '@tanstack/react-query'
import { format, isBefore, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Check,
  CirclePlus,
  Clock,
  Stethoscope,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'

import { getPatients } from '@/api/get-patients'
import { getUser, type PatientProps } from '@/api/get-user'
import { getUsers } from '@/api/get-users'
import { registerSchedule } from '@/api/register-schedule'
import { TimeSlots } from '@/components/times-slots'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

export interface SpecialistProps {
  id: string
  name: string
  username: string
  crm: string
  role: string
  patient: PatientProps
  createdAt: Date
  updatedAt: Date
}

const times = [
  {
    time: '09:00',
  },
  {
    time: '09:30',
  },
  {
    time: '10:00',
  },
  {
    time: '10:30',
  },
  {
    time: '11:00',
  },
  {
    time: '11:30',
  },
  {
    time: '13:30',
  },
  {
    time: '14:00',
  },
  {
    time: '14:30',
  },
  {
    time: '15:00',
  },
  {
    time: '15:30',
  },
  {
    time: '16:00',
  },
  {
    time: '16:30',
  },
]

export function NewSchedule() {
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: Infinity,
  })

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ isDoctor: true }),
    staleTime: Infinity,
  })

  const specialists = Array.isArray(users) ? users : []

  const { mutateAsync: registerScheduleFn } = useMutation({
    mutationFn: registerSchedule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules'] })

      setDate(undefined)
      setPatient(undefined)
      setHour(null)
      setSpecialist(user?.crm ? user : null)

      toast({
        variant: 'default',
        title: 'Agendamento',
        description: 'Agendado realizado!',
        action: (
          <ToastAction altText="Fazer login">
            Enviar lembrete por WhatsApp
          </ToastAction>
        ),
        onClick: () => sendMessageWhatsApp(),
      })
    },
  })

  const [specialist, setSpecialist] = useState<SpecialistProps | null>(
    user?.crm ? user : null,
  )
  const [patient, setPatient] = useState<PatientProps>()
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState<string | null>(null)

  function sendMessageWhatsApp() {
    const phone = patient?.phone

    if (!phone) {
      toast({
        variant: 'destructive',
        title: 'Número indisponível',
        description: 'O paciente não tem número de WhatsApp cadastrado.',
      })
      return
    }

    const message = `Olá, ${patient.name}. Seu agendamento está confirmado para ${date ? format(date, 'PPP', { locale: ptBR }) : 'data não definida'} às ${hour}.`
    const formattedMessage = encodeURIComponent(message)
    const whatsAppUrl = `https://wa.me/${phone}?text=${formattedMessage}`

    window.open(whatsAppUrl, '_blank')
  }

  async function handleCreateNewSchedule() {
    try {
      if (!patient || !date || !hour) {
        return toast({
          variant: 'destructive',
          title: 'Agendamento',
          description: 'Preencha todos os campos para agendar.',
        })
      }

      const dateHour =
        date && hour ? `${format(date, 'yyyy-MM-dd')}T${hour}:00` : ''

      await registerScheduleFn({
        specialistId: specialist?.id ?? '',
        patientId: patient.id,
        dateHour,
      })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)
      toast({
        variant: 'destructive',
        title: 'Agendamento',
        description: errorMessage,
      })
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex-col justify-between rounded-lg bg-muted p-10 md:flex">
        <div className="space-y-4">
          <div className="flex flex-row items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Novo agendamento
            </h1>
          </div>
          <p className="pb-2 text-sm text-muted-foreground">
            Selecione data, horário e informe o nome do paciente para criar o
            agendamento
          </p>

          <div className="flex flex-col space-y-4">
            {user?.crm ? (
              <div className="space-y-1">
                <Label htmlFor="medic name">Médico</Label>
                <Input className="h-12" disabled value={user?.name} />
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="patient name">Médico</Label>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Stethoscope className="mr-2 h-4 w-4 text-primary" />
                      {specialist ? (
                        specialists?.find((p) => p.name === specialist.name)
                          ?.name
                      ) : (
                        <span className="text-muted-foreground">
                          Selecione o médico
                        </span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <Command>
                    <CommandInput placeholder="Pesquise aqui..." />

                    <CommandList>
                      <CommandEmpty>Nenhum médico encontrado</CommandEmpty>
                      <CommandGroup>
                        {specialists.map((u) => (
                          <CommandItem
                            key={u.id}
                            value={u.name}
                            onSelect={(currentValue) => {
                              const selectedUser = specialists.find(
                                (doc) => doc.name === currentValue,
                              )
                              if (selectedUser) {
                                setSpecialist(selectedUser)
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                u.name === specialist?.name
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {u.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="patient name">Paciente</Label>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <UserRound className="mr-2 h-4 w-4 text-primary" />
                    {patient ? (
                      patients?.find((p) => p.name === patient.name)?.name
                    ) : (
                      <span className="text-muted-foreground">
                        Selecione o paciente
                      </span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Command>
                  <div className="p-4">
                    <Button className="gap-3">
                      <CirclePlus />
                      <Label>Adicionar novo paciente</Label>
                    </Button>
                  </div>
                  <CommandInput placeholder="Pesquise aqui..." />

                  <CommandList>
                    <CommandEmpty>Nenhum paciente encontrado</CommandEmpty>
                    <CommandGroup>
                      {patients?.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={p.name}
                          onSelect={(currentValue) => {
                            const selectedPatient = patients?.find(
                              (p) => p.name === currentValue,
                            )
                            setPatient(selectedPatient)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              p.name === patient?.name
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {p.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="schedule date">Data</Label>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? (
                      format(date, 'PPP', { locale: ptBR })
                    ) : (
                      <span className="text-muted-foreground">
                        Selecione a data
                      </span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  modifiers={{
                    disabled: (date) =>
                      !isToday(date) && isBefore(date, new Date()),
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="flex flex-col gap-2 pb-4">
              <Label className="text-lg">Horários</Label>

              <TimeSlots
                label="Selecione o horário da consulta"
                date={date ? format(date, 'yyyy-MM-dd') : ''}
                times={times}
                onSelect={setHour}
              />
            </div>

            <Button
              size="lg"
              title="Realizar agendamento"
              className="w-full gap-2"
              onClick={handleCreateNewSchedule}
            >
              <Check />
              Agendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
