import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'

type TimeSlotProps = {
  label: string
  times: { time: string }[]
}

export function TimeSlots({ label, times }: TimeSlotProps) {
  return (
    <>
      <Label className="text-sm font-normal text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-wrap gap-3">
        {times.map((time) => (
          <Toggle
            key={time.time}
            variant="outline"
            className="min-w-24 max-w-32"
          >
            {time.time}
          </Toggle>
        ))}
      </div>
    </>
  )
}
