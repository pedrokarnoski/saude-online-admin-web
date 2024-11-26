import { api } from '@/lib/axios'

export interface DeleteScheduleQuery {
  id: string
}

export async function deleteSchedule({ id }: DeleteScheduleQuery) {
  await api.delete(`/schedules/${id}`)
}
