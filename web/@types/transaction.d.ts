interface Transaction {
    id: string
    userId: string
    bankId: number
    categoryId: number
    amount: string
    description: string
    date: string
    createdAt: string
    updatedAt: string
    category: Category
    bank: Bank
}

interface TransactionTotals {
    balance: number
    credit: number
    debit: number
}