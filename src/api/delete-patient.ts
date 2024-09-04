import { api } from '@/lib/axios'

export interface DeletePatientQuery {
  id: string
}

export async function deletePatient({ id }: DeletePatientQuery) {
  await api.delete(`/patients/${id}`)
}
