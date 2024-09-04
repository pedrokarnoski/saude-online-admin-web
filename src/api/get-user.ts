import { api } from '@/lib/axios'

export interface GetUserResponse {
  user: {
    id: string
    name: string
    username: string
    password: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function getUser() {
  const response = await api.get<GetUserResponse>(`/me`)

  return response.data.user
}
