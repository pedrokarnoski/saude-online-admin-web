import { api } from '@/lib/axios'

import type { PatientProps } from './get-user'

export interface GetScheduleResponse {
  schedules: {
    id: string
    patientId: string
    patient: PatientProps[]
    date: string
    hour: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function getSchedule() {
  const response = await api.get<GetScheduleResponse>('/schedules')

  return response.data.schedules
}
