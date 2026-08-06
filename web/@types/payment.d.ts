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
