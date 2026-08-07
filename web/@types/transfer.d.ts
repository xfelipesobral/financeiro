interface Transfer {
    id: number
    guid: string
    userId: number
    fromBankAccountId: number
    toBankAccountId: number
    amount: number
    description: string
    date: string
    createdAt: string
    updatedAt: string
    fromBankAccount: BankAccount
    toBankAccount: BankAccount
    transactions: Transaction[]
}
