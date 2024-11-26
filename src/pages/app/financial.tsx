import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getSchedule } from '@/api/get-schedule'
import { FinancialTable } from '@/components/financial-table'

export function Financial() {
  const { data: financial = [], isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['financial'],
    queryFn: getSchedule,
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Financeiro" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingFinancial ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <FinancialTable data={financial} />
        )}
      </div>
    </>
  )
}
