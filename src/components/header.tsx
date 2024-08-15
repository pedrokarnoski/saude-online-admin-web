import { HeartPulse } from 'lucide-react'

import { AccountMenu } from '@/components/account-menu'

export function Header() {
  return (
    <div className="bg-primary px-8">
      <div className="flex h-20 items-center justify-between px-6 font-medium text-white">
        <div className="flex items-center gap-3 text-lg">
          <HeartPulse className="size-8 text-red-500" />
          <span className="text-xl tracking-wider">SaúdeOnline</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
