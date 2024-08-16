import { api } from '@/lib/axios'

export interface GetPatientsResponse {
  patients: {
    id: string
    name: string
    age: number
    document: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export async function getPatients() {
  const response = await api.get<GetPatientsResponse>(`/patients`)

  return response.data.patients
}
