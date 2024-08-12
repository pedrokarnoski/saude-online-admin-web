import { HeartPulse } from 'lucide-react'

export function Header() {
  return (
    <div className="border-b bg-primary">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="flex items-center gap-3 text-lg">
          <HeartPulse className="h-8 w-8 text-red-500" />
          <span className="flex flex-row text-xl font-medium tracking-wider text-secondary">
            SaúdeOnline
          </span>
        </div>
      </div>
    </div>
  )
}
