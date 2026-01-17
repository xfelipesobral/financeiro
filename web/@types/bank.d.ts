interface Bank {
    id: number
    guid: string
    name: string
    createdAt: string
    updatedAt: string
}

interface BankAccount {
    id: number
    guid: string
    description: string
    bankId: number
    userId: number
    branchCode: string
    accountNumber: string
    pixKeys: string[]
    createdAt: string
    updatedAt: string
    bank: Bank
}
