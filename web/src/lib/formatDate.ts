import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function brDateTime(date: Date | number | string) {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}