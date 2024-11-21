import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getPatients } from '@/api/get-patients'
import { PatientTable } from '@/components/patients-table'

export function Patients() {
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Pacientes" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingPatients ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <PatientTable data={patients || []} />
          </>
        )}
      </div>
    </>
  )
}
