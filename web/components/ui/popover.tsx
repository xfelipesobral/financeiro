'use client'

import * as React from 'react'
import { Popover as PopoverPrimitive } from '@base-ui/react'

import { cn } from '@/lib/utils'

const Popover = PopoverPrimitive.Root

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
    className,
    side = 'bottom',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    container,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
    Pick<React.ComponentProps<typeof PopoverPrimitive.Positioner>, 'side' | 'sideOffset' | 'align' | 'alignOffset'> &
    Pick<React.ComponentProps<typeof PopoverPrimitive.Portal>, 'container'>) {
    return (
        <PopoverPrimitive.Portal container={container}>
            <PopoverPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} className="z-50">
                <PopoverPrimitive.Popup
                    data-slot="popover-content"
                    className={cn(
                        'w-72 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                        className,
                    )}
                    {...props}
                />
            </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
    )
}

export { Popover, PopoverContent, PopoverTrigger }
