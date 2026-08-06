interface Loan {
    id: number
    guid: string
    userId: number
    bankAccountId: number
    description: string
    totalAmount: number
    installmentTotal: number
    dueDay: number
    interestRate: number | null
    startDate: string
    createdAt: string
    updatedAt: string
    bankAccount: BankAccount
    payments: Payment[]
}
