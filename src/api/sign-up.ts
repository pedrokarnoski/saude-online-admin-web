import { api } from '@/lib/axios'

export interface SignUpBody {
  name: string
  username: string
  crm?: string
  password: string
  role: string
  specialties: string[]
}

export async function signUp({
  name,
  username,
  password,
  crm,
  role,
  specialties,
}: SignUpBody) {
  await api.post('/users', { name, username, crm, password, role, specialties })
}
