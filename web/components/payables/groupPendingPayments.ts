// Agrupa os Payments PENDING do usuário (GET /payment/pending) por mês de vencimento e, dentro do
// mês, por origem: fatura de cartão (cardId + dueDate exato — todas as parcelas de um cartão que
// vencem no mesmo mês compartilham o mesmo dueDate, ver api/src/utils/calculateMonthlyDueDates.ts)
// ou parcela de empréstimo (loanId + mês). Hoje todo Payment PENDING tem cardId XOR loanId (garantido
// por api/src/modules/transaction/functions/buildTransactionPayments.ts) — itens que não caem em
// nenhum dos dois são ignorados, por robustez.

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

export interface MonthGroup {
    monthKey: string
    monthLabel: string
    cardGroups: CardInvoiceGroup[]
    loanGroups: LoanInstallmentGroup[]
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
            month = { monthKey, monthLabel: monthLabelOf(monthKey), cardGroups: [], loanGroups: [] }
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
        }
    }

    return [...monthsByKey.values()].sort((a, b) => a.monthKey.localeCompare(b.monthKey))
}

export function isOverdue(dueDate: string) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return new Date(dueDate) < today
}
