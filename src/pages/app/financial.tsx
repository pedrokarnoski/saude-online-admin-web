import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getSchedule } from '@/api/get-schedule'
import { HistoricTable } from '@/components/historic-table'

export function Financial() {
  const { data: historic = [], isLoading: isLoadingHistoric } = useQuery({
    queryKey: ['historic'],
    queryFn: getSchedule,
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Financeiro" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingHistoric ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <HistoricTable data={historic} />
        )}
      </div>
    </>
  )
}
