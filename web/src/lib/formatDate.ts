import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function brDateTime(date: Date | number | string) {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

export function brDate(date: Date | number | string) {
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

// Pega a data inicial e final da semana atual
export function currentWeekPeriod() {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 (Domingo) a 6 (Sábado)

    const initialDate = new Date(today)
    initialDate.setDate(today.getDate() - dayOfWeek) // Vai para o Domingo

    const finalDate = new Date(today);
    finalDate.setDate(today.getDate() + (6 - dayOfWeek)) // Vai para o Sábado

    // Resetando a hora para 00:00:00 para a data de início e para 23:59:59 para a data de fim
    initialDate.setHours(0, 0, 0, 0)
    finalDate.setHours(23, 59, 59, 999)

    return {
        initialDate,
        finalDate
    }
}

// Pega a data inicial e final do mes atual
export function currentMonthPeriod() {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Muda as horas para 00:00:00

    const initialDate = new Date(today.getFullYear(), today.getMonth(), 1)
    const finalDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    finalDate.setHours(23, 59, 59) // Muda para o maximo de horas

    return {
        initialDate,
        finalDate
    }
}

// Pega a data inicial e final do ano atual
export function currentYearPeriod() {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Muda as horas para 00:00:00

    const initialDate = new Date(today.getFullYear(), 0, 1)
    const finalDate = new Date(today.getFullYear(), 11, 31)

    finalDate.setHours(23, 59, 59) // Muda para o maximo de horas

    return {
        initialDate,
        finalDate
    }
}