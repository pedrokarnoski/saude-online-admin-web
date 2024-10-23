import { isBefore, parse } from 'date-fns'
import { useState } from 'react'

import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type TimeSlotProps = {
  label: string
  times: { time: string }[]
  onSelect: (time: string) => void
}

export function TimeSlots({ label, times, onSelect }: TimeSlotProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Checar hora para desabilitar agendamento no passado
  const isPastTime = (time: string) => {
    const timeDate = parse(time, 'HH:mm', new Date())

    return isBefore(timeDate, new Date())
  }

  const handleSelect = (value: string) => {
    setSelectedTime(value)
    onSelect(value)
  }

  return (
    <div>
      <Label className="text-sm font-normal text-muted-foreground">
        {label}
      </Label>
      <ToggleGroup
        type="single"
        value={selectedTime ?? ''}
        onValueChange={handleSelect}
        className="flex flex-wrap justify-start gap-3 py-2"
      >
        {times.map((time) => (
          <ToggleGroupItem
            key={time.time}
            variant="outline"
            value={time.time}
            className="w-16 bg-background"
            disabled={isPastTime(time.time)}
          >
            {time.time}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
