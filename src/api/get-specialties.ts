import { api } from '@/lib/axios'

export interface SpecialtyOption {
  value: string
  label: string
}

export interface GetSpecialtiesResponse {
  specialties: {
    id: string
    name: string
  }[]
}

export async function getSpecialties(): Promise<SpecialtyOption[]> {
  try {
    const response = await api.get<GetSpecialtiesResponse>('/specialties')

    if (response.data && response.data.specialties) {
      const formattedSpecialties = response.data.specialties.map(
        (specialty) => ({
          value: specialty.id,
          label: specialty.name,
        }),
      )
      console.log('Especialidades formatadas:', formattedSpecialties)
      return formattedSpecialties
    } else {
      console.warn('Nenhuma especialidade encontrada no retorno da API.')
      return []
    }
  } catch (error) {
    console.error('Erro ao buscar especialidades:', error)
    return []
  }
}
