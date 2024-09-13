import { Helmet } from 'react-helmet-async'

import { NewSchedule } from '@/components/new-schedule'
import { Schedule } from '@/components/schedule'

export function Schedules() {
  return (
    <div>
      <Helmet title="Painel" />

      <div className="grid min-h-[calc(100vh-125px)] grid-cols-1 md:grid-cols-[30%_1fr]">
        <NewSchedule />

        <div className="ml-8 flex flex-col p-6 md:p-10">
          <Schedule />
        </div>
      </div>
    </div>
  )
}
