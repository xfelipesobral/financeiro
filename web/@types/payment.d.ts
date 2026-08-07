type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED'

interface Payment {
    id: number
    guid: string
    userId: number
    paymentMethodId: number
    transactionId: number
    cardId: number | null
    loanId: number | null
    amount: number
    installmentNumber: number | null
    description: string | null
    status: PaymentStatus
    dueDate: string
    paidAt: string | null
    createdAt: string
    updatedAt: string
    card?: Card | null
    loan?: Loan | null
}

// Payment PENDING retornado por GET /payment/pending, usado no dashboard "Contas a pagar" — sempre
// traz a descrição da transação original (compra que gerou a parcela) como rótulo de fallback.
type PendingPayment = Payment & {
    transaction: {
        id: number
        description: string
    }
}
