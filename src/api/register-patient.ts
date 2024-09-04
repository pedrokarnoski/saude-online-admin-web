import { api } from '@/lib/axios'

export interface RegisterPatientBody {
  name: string
  age: number
  document: string
}

export async function registerPatient({
  name,
  age,
  document,
}: RegisterPatientBody) {
  await api.post('/patients', { name, age, document })
}
