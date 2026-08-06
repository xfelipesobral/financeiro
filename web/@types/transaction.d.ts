type TransactionStatus = 'PENDING' | 'PAID'

interface Transaction {
    id: number
    guid: string
    userId: number
    bankAccountId: number
    categoryId: number
    totalAmount: number
    description: string
    installmentTotal: number | null
    date: string
    createdAt: string
    updatedAt: string
    category: Category
    bankAccount: BankAccount
    payments: Payment[]
    status: TransactionStatus
}
