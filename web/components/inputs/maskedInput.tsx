import IMask, { FactoryOpts } from 'imask'
import { Input } from '../ui/input'
import { useEffect, useRef } from 'react'

interface MaskedInputProps extends React.ComponentProps<typeof Input> {
    maskOptions: FactoryOpts
    onValueChange?: (value: string) => void
}

type MaskedInputPropsWithoutMaskOptions = Omit<MaskedInputProps, 'maskOptions'>

export function MaskedInput({ maskOptions, onValueChange, ref, ...props }: MaskedInputProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!inputRef.current) return

        const mask = IMask(inputRef.current, maskOptions)
        mask.on('accept', () => onValueChange?.(mask.unmaskedValue))

        return () => mask.destroy()
    }, [])

    return (
        <Input
            ref={(el) => {
                inputRef.current = el
                if (typeof ref === 'function') ref(el)
                else if (ref) ref.current = el
            }}
            {...props}
        />
    )
}

interface DecimalInputProps extends MaskedInputPropsWithoutMaskOptions {
    decimalPlaces?: number
}

export function DecimalInput({ decimalPlaces = 2, ...props }: DecimalInputProps) {
    return (
        <MaskedInput
            maskOptions={{
                mask: Number,
                radix: '.',
                thousandsSeparator: '',
                scale: decimalPlaces,
            }}
            {...props}
        />
    )
}

export function IntegerInput(props: MaskedInputPropsWithoutMaskOptions) {
    return (
        <MaskedInput
            maskOptions={{
                mask: Number,
                scale: 0,
            }}
            {...props}
        />
    )
}
