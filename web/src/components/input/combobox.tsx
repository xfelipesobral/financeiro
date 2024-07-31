'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '../ui/label'

interface ComboboxProps {
    id: string
    title?: string
    selected?: ComboboxItem
    list: ComboboxItem[]
    placeholder?: string
    searchText?: string
    emptyList?: string
    onChange: (value: ComboboxItem) => void
}

export function Combobox({ id, title, selected, list, placeholder, searchText, emptyList, onChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className='w-full flex flex-col space-y-1'>
            {title && <Label htmlFor={id}>{title}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button id={id} className='border p-2 rounded-lg cursor-pointer text-sm font-medium flex items-center min-h-10 text-left hover:bg-muted'>
                        <p className='flex-1'>{selected?.label || <span className='text-muted-foreground font-normal'>{placeholder}</span>}</p>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </button>
                </PopoverTrigger>
                <PopoverContent align='start' className='p-0 popover-content-width-full'>
                    <Command>
                        <CommandInput
                            placeholder={searchText || 'Pesquisar...'}
                            autoFocus
                        />
                        <CommandList>
                            <CommandEmpty>{emptyList || 'Lista vazia'}</CommandEmpty>
                            <CommandGroup>
                                {list.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        className='flex gap-2'
                                        onSelect={() => {
                                            onChange(item)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'h-4 w-4',
                                                selected?.value === item.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        <span className='flex-1'>{item.label}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

        </div>
    )
}
