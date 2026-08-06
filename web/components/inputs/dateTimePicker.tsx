'use client'

import { type ComponentProps, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Params {
    id?: string
    value: Date
    onChange: (date: Date) => void
    container?: ComponentProps<typeof PopoverContent>['container']
}

export function DateTimePicker({ id, value, onChange, container }: Params) {
    const [open, setOpen] = useState(false)

    const handleDaySelect = (day?: Date) => {
        if (!day) return

        const next = new Date(day)
        next.setHours(value.getHours(), value.getMinutes(), 0, 0)

        onChange(next)
        setOpen(false)
    }

    const handleTimeChange = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number)

        if (isNaN(hours) || isNaN(minutes)) return

        const next = new Date(value)
        next.setHours(hours, minutes, 0, 0)

        onChange(next)
    }

    return (
        <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button variant="outline" id={id} className="flex-1 justify-start px-2.5 font-normal">
                            <CalendarIcon data-icon="inline-start" />
                            {format(value, 'dd/MM/yyyy', { locale: ptBR })}
                        </Button>
                    }
                />
                <PopoverContent className="w-auto p-0" align="start" container={container}>
                    <Calendar mode="single" locale={ptBR} selected={value} defaultMonth={value} onSelect={handleDaySelect} captionLayout="dropdown" />
                </PopoverContent>
            </Popover>

            <Input
                type="time"
                aria-label="Hora"
                value={format(value, 'HH:mm')}
                onChange={(event) => handleTimeChange(event.target.value)}
                className="w-28"
            />
        </div>
    )
}
