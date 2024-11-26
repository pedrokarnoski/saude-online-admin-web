import { api } from '@/lib/axios'

export interface Patient {
  id: string
  name: string
}

export interface Schedule {
  id: string
  dateHour: string
  value: string
  patientName: string
  patientPhone: string
  patient: Patient
}

export interface GetScheduleResponse {
  schedules: Schedule[]
}

export async function getSchedule(): Promise<Schedule[]> {
  const response = await api.get<GetScheduleResponse>('/schedules')

  return response.data.schedules
}
