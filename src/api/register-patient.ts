import { api } from '@/lib/axios'

export interface RegisterPatientBody {
  name: string
  age: number
  document: string
  phone?: string
}

export async function registerPatient({
  name,
  age,
  document,
  phone,
}: RegisterPatientBody) {
  await api.post('/patients', { name, age, document, phone })
}
