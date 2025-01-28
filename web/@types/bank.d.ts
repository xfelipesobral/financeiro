interface Bank {
    id: number
    name: string
    createdAt: string
    updatedAt: string
}

interface BankAccount {
    id: string
    description: string | null
    bankId: number
    userId: string
    createdAt: Date
    updatedAt: Date
}
