import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface SelectDateProps {
    id: string
    title?: string
    selected?: Date
    placeholder?: string
    onChange: (value?: Date) => void
}

export function SelectDate({ id, title, selected, placeholder, onChange }: SelectDateProps) {

    return (
        <div className='w-full flex flex-col space-y-1'>
            {title && <Label htmlFor={id}>{title}</Label>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant='outline'
                        className={cn(
                            'justify-start text-left font-normal',
                            !selected && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {selected ? format(selected, 'PPP', { locale: ptBR }) : <span>{placeholder || 'Selecionar data'}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                    <Calendar
                        mode='single'
                        selected={selected}
                        onSelect={onChange}
                        locale={ptBR}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}