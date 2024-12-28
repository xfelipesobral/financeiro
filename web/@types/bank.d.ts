interface Bank {
    id: number
    name: string
    createdAt: string
    updatedAt: string
}

interface BankAccount {
    id: number
    bank: Bank
    description: string
    createdAt: string
    updatedAt: string
}
