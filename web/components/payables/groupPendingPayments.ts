// Agrupa os Payments PENDING do usuário (GET /payment/pending) por mês de vencimento e, dentro do
// mês, por origem: fatura de cartão (cardId + dueDate exato — todas as parcelas de um cartão que
// vencem no mesmo mês compartilham o mesmo dueDate, ver api/src/utils/calculateMonthlyDueDates.ts),
// parcela de empréstimo (loanId + mês), ou PIX/débito agendado (sem cardId nem loanId — ver
// buildTransactionPayments.ts/acceptScheduledPayment.ts). Um Payment agendado é sempre seu próprio
// grupo (não compartilha vencimento com mais ninguém, ao contrário de fatura/parcela).

export interface CardInvoiceGroup {
    key: string
    cardId: number
    dueDate: string
    totalAmount: number
    payments: PendingPayment[]
}

export interface LoanInstallmentGroup {
    key: string
    loanId: number
    dueDate: string
    totalAmount: number
    payments: PendingPayment[]
}

export interface ScheduledPaymentGroup {
    key: string
    dueDate: string
    totalAmount: number
    payment: PendingPayment
}

export interface MonthGroup {
    monthKey: string
    monthLabel: string
    cardGroups: CardInvoiceGroup[]
    loanGroups: LoanInstallmentGroup[]
    scheduledGroups: ScheduledPaymentGroup[]
}

const MONTH_LABELS = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
]

function monthKeyOf(dueDate: string) {
    const date = new Date(dueDate)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function monthLabelOf(monthKey: string) {
    const [year, month] = monthKey.split('-').map(Number)
    return `${MONTH_LABELS[month - 1]}/${year}`
}

export function groupPendingPayments(payments: PendingPayment[]): MonthGroup[] {
    const monthsByKey = new Map<string, MonthGroup>()
    const cardGroupsByKey = new Map<string, CardInvoiceGroup>()
    const loanGroupsByKey = new Map<string, LoanInstallmentGroup>()

    for (const payment of payments) {
        const monthKey = monthKeyOf(payment.dueDate)

        let month = monthsByKey.get(monthKey)

        if (!month) {
            month = { monthKey, monthLabel: monthLabelOf(monthKey), cardGroups: [], loanGroups: [], scheduledGroups: [] }
            monthsByKey.set(monthKey, month)
        }

        if (payment.cardId) {
            const key = `${payment.cardId}-${payment.dueDate}`
            let group = cardGroupsByKey.get(key)

            if (!group) {
                group = { key, cardId: payment.cardId, dueDate: payment.dueDate, totalAmount: 0, payments: [] }
                cardGroupsByKey.set(key, group)
                month.cardGroups.push(group)
            }

            group.totalAmount += payment.amount
            group.payments.push(payment)
        } else if (payment.loanId) {
            const key = `${payment.loanId}-${monthKey}`
            let group = loanGroupsByKey.get(key)

            if (!group) {
                group = { key, loanId: payment.loanId, dueDate: payment.dueDate, totalAmount: 0, payments: [] }
                loanGroupsByKey.set(key, group)
                month.loanGroups.push(group)
            }

            group.totalAmount += payment.amount
            group.payments.push(payment)
        } else {
            month.scheduledGroups.push({ key: String(payment.id), dueDate: payment.dueDate, totalAmount: payment.amount, payment })
        }
    }

    return [...monthsByKey.values()].sort((a, b) => a.monthKey.localeCompare(b.monthKey))
}

export function isOverdue(dueDate: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return new Date(dueDate) < today
}
