import { api } from '@/lib/axios'

export type PatientProps = {
  id: string
  name: string
  age: number
  document: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface GetUserResponse {
  user: {
    id: string
    name: string
    username: string
    crm: string
    role: string
    patient: PatientProps
    createdAt: Date
    updatedAt: Date
  }
}

interface GetUserProps {
  userId?: string
}

export async function getUser({ userId = '' }: GetUserProps) {
  // Se userId for fornecido, a rota será modificada
  const endpoint = userId?.length ? `/me?userId=${userId}` : '/me'

  const response = await api.get<GetUserResponse>(endpoint)

  return response.data.user
}
