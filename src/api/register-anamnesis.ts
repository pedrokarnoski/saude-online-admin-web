import { api } from '@/lib/axios'

export interface RegisterAnamnesisBody {
  patientId: string
  age: number
  weight: string
  height: string
  symptoms: string
  medicalHistory?: string
  allergies?: string
}

export async function registerAnamnesis({
  patientId,
  age,
  weight,
  height,
  symptoms,
  medicalHistory,
  allergies,
}: RegisterAnamnesisBody) {
  await api.post('/anamnesis', {
    patientId,
    age,
    weight,
    height,
    symptoms,
    medicalHistory,
    allergies,
  })
}
