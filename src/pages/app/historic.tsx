import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Frown, Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import { getUser, type HistoricData } from '@/api/get-user'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Historic() {
  const { id } = useParams()

  const { data: historic = {}, isLoading: isLoadingHistoric } =
    useQuery<HistoricData>({
      queryKey: ['historic'],
      queryFn: () => getUser({ userId: id }),
      staleTime: Infinity,
    })

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser({ userId: '' }),
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Histórico do paciente" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingHistoric ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div>
            <Tabs defaultValue="consulta" className="space-y-4">
              <TabsList>
                <TabsTrigger value="consulta">Consultas</TabsTrigger>
                <TabsTrigger value="exame">Exames</TabsTrigger>
                {user?.crm && (
                  <TabsTrigger value="anamnese">Anamneses</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="consulta">
                {historic?.schedules && historic?.schedules.length > 0 ? (
                  <Card className="p-4">
                    {historic?.schedules.map((schedule, index) => (
                      <ul key={schedule.id}>
                        <li>
                          Dia{' '}
                          {format(
                            new Date(schedule.dateHour),
                            "dd/MM/yyyy 'às' HH:mm",
                          )}{' '}
                          com <Label>{schedule.specialistName}</Label>
                          {index < (historic?.schedules?.length ?? 0) - 1 && (
                            <Separator className="my-4" />
                          )}
                        </li>
                      </ul>
                    ))}
                  </Card>
                ) : (
                  <div className="flex items-center justify-center gap-4 py-20 text-muted-foreground">
                    <Frown />
                    <Label className="text-lg">Sem resultados.</Label>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="exame">
                {historic?.exams && historic?.exams.length > 0 ? (
                  <Card className="p-4">
                    {historic?.exams.map((exam, index) => (
                      <ul key={exam.id}>
                        <li>
                          Dia{' '}
                          {format(
                            new Date(exam.dateHour),
                            "dd/MM/yyyy 'às' HH:mm",
                          )}{' '}
                          - <Label>{exam.examName}</Label>
                          {index < (historic?.exams?.length ?? 0) - 1 && (
                            <Separator className="my-4" />
                          )}
                        </li>
                      </ul>
                    ))}
                  </Card>
                ) : (
                  <div className="flex items-center justify-center gap-4 py-20 text-muted-foreground">
                    <Frown />
                    <Label className="text-lg">Sem resultados.</Label>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="anamnese">
                {historic?.anamneses && historic?.anamneses.length > 0 ? (
                  <Card className="p-4">
                    {historic?.anamneses.map((anamnese, index) => (
                      <ul key={anamnese.id}>
                        <li>
                          <Label>Efetuada em:</Label>{' '}
                          {format(
                            new Date(anamnese.createdAt),
                            "dd/MM/yyyy 'às' HH:mm",
                          )}
                        </li>
                        <li>
                          <Label>Idade:</Label> {anamnese.age} anos
                        </li>
                        <li>
                          <Label>Peso:</Label> {anamnese.weight} kg
                        </li>
                        <li>
                          <Label>Altura:</Label> {anamnese.height} m
                        </li>
                        <li>
                          <Label>Sintomas:</Label> {anamnese.symptoms}
                        </li>
                        <li>
                          <Label>Histórico médico:</Label>{' '}
                          {anamnese.medicalHistory}
                        </li>
                        <li>
                          <Label>Alergias:</Label> {anamnese.allergies}
                          {index < (historic?.anamneses?.length ?? 0) - 1 && (
                            <Separator className="my-4" />
                          )}
                        </li>
                      </ul>
                    ))}
                  </Card>
                ) : (
                  <div className="flex items-center justify-center gap-4 py-20 text-muted-foreground">
                    <Frown />
                    <Label className="text-lg">Sem resultados.</Label>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  )
}
