import { Helmet } from 'react-helmet-async'

export function Prescription() {
  return (
    <>
      <Helmet title="Receituário" />

      <div className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Receituário</h1>
      </div>
    </>
  )
}
