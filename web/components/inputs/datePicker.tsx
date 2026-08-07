'use client'

import { type ComponentProps, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Params {
    id?: string
    value: Date
    onChange: (date: Date) => void
    container?: ComponentProps<typeof PopoverContent>['container']
}

export function DatePicker({ id, value, onChange, container }: Params) {
    const [open, setOpen] = useState(false)

    const handleDaySelect = (day?: Date) => {
        if (!day) return

        onChange(day)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button variant="outline" id={id} className="w-full justify-start px-2.5 font-normal">
                        <CalendarIcon data-icon="inline-start" />
                        {format(value, 'dd/MM/yyyy', { locale: ptBR })}
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-0" align="start" container={container}>
                <Calendar mode="single" locale={ptBR} selected={value} defaultMonth={value} onSelect={handleDaySelect} captionLayout="dropdown" />
            </PopoverContent>
        </Popover>
    )
}
