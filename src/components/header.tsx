import { HeartPulse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AccountMenu } from '@/components/account-menu'

export function Header() {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <div className="bg-primary px-8">
      <div className="flex h-20 items-center justify-between px-6 font-medium text-white">
        <button
          className="flex items-center gap-3 text-lg"
          onClick={handleHomeClick}
        >
          <HeartPulse className="size-8 text-red-500" />
          <span className="text-xl tracking-wider">SaúdeOnline</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
