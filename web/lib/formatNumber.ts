export function numberToReal(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function numberToBrl(value: number | string) {
    if (typeof value === 'string') {
        value = parseFloat(value)
    }

    if (isNaN(value)) {
        return 'R$ 0,00'
    }

    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
