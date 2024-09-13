import { useQuery } from '@tanstack/react-query'
import { LoaderIcon, UsersRound } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getPatients } from '@/api/get-patients'
import { PatientTable } from '@/components/patients-table'

export function Patients() {
  const { data: result, isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatients(),
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Pacientes" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingPatients ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : result?.length ? (
          <>
            <PatientTable data={result} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <UsersRound className="mt-12 h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-semibold leading-7">
                Você ainda não tem clientes cadastradas
              </p>
              <span>Cadastre seus pacientes de forma rápida e fácil</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
