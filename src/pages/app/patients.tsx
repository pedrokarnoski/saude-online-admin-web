import { Helmet } from 'react-helmet-async'

export function Patients() {
  return (
    <>
      <Helmet title="Pacientes" />

      <div className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
      </div>
    </>
  )
}
