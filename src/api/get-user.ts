import { api } from '@/lib/axios'

type Schedule = {
  id: string
  dateHour: string
  specialistName: string
}

type Exam = {
  id: string
  dateHour: string
  examName: string
}

type Anamnese = {
  id: string
  createdAt: string
  age: number
  weight: number
  height: number
  symptoms: string
  medicalHistory: string
  allergies: string
}

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
    schedules?: Schedule[]
    exams?: Exam[]
    anamneses?: Anamnese[]
    createdAt: Date
    updatedAt: Date
  }
}

interface GetUserProps {
  userId?: string
}

export type HistoricData = {
  schedules?: Schedule[]
  exams?: Exam[]
  anamneses?: Anamnese[]
}

export async function getUser({ userId = '' }: GetUserProps) {
  // Se userId for fornecido, a rota será modificada
  const endpoint = userId?.length ? `/me?userId=${userId}` : '/me'

  const response = await api.get<GetUserResponse>(endpoint)

  return response.data.user
}
