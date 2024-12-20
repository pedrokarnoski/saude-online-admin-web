import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/pages/_layouts/app'
import { AuthLayout } from '@/pages/_layouts/auth'
import { NotFound } from '@/pages/404'
import { Anamnesis } from '@/pages/app/anamnesis'
import { Financial } from '@/pages/app/financial'
import { Historic } from '@/pages/app/historic'
import { Home } from '@/pages/app/home'
import { Patients } from '@/pages/app/patients'
import { Prescription } from '@/pages/app/prescription'
import { Schedules } from '@/pages/app/schedules'
import { SignIn } from '@/pages/auth/sign-in'
import { SignUp } from '@/pages/auth/sign-up'
import { Error } from '@/pages/error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/anamnesis', element: <Anamnesis /> },
      { path: '/financial', element: <Financial /> },
      { path: '/historic/:id', element: <Historic /> },
      { path: '/patients', element: <Patients /> },
      { path: '/prescription', element: <Prescription /> },
      { path: '/schedule', element: <Schedules /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
