import { useMutation, useQuery } from '@tanstack/react-query'
import { format, isBefore, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Check,
  CirclePlus,
  Clock,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'

import { getPatients } from '@/api/get-patients'
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
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

import { Patient as PatientProps } from './patients-table'

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

  const { mutateAsync: registerScheduleFn } = useMutation({
    mutationFn: registerSchedule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules'] })
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const [patient, setPatient] = useState<PatientProps>()
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState<string | null>(null)

  async function handleCreateNewSchedule() {
    try {
      if (!patient || !date || !hour) {
        return toast({
          variant: 'destructive',
          title: 'Agendamento',
          description: 'Preencha todos os campos para agendar.',
        })
      }

      const dateHour = date
        ? format(date, 'yyyy-MM-dd') + 'T' + hour + ':00'
        : ''

      await registerScheduleFn({
        patient: patient as PatientProps,
        dateHour,
      })

      toast({
        variant: 'default',
        title: 'Agendamento',
        description: 'Agendado realizado!',
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                  <Label className="text-lg">Paciente</Label>
                  <Button
                    size="lg"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-start text-left font-normal hover:bg-black/30"
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
                      {patients &&
                        patients.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={p.name}
                            onSelect={(currentValue) => {
                              const selectedPatient = patients?.find(
                                (p) => p.name === currentValue,
                              )
                              setPatient(selectedPatient)

                              setOpen(false)
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
                  <Label className="text-lg">Data</Label>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-start text-left font-normal hover:bg-black/30"
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
