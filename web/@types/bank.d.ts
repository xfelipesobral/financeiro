interface Bank {
    id: number
    guid: string
    name: string
    createdAt: string
    updatedAt: string
}

interface BankAccountPix {
    id: number
    bankAccountId: number
    type: string
    value: string
}

interface BankAccount {
    id: number
    guid: string
    description: string | null
    bankId: number
    userId: number
    branchCode: string
    accountNumber: string
    pixs: BankAccountPix[]
    createdAt: string
    updatedAt: string
    bank: Bank
    // Créditos - débitos das transações da conta (exclui compras no cartão de crédito, que só saem
    // da conta quando a fatura é paga). Ver api/src/modules/bankAccount/functions/calculateBalances.ts.
    balance: number
}

type CardType = 'CREDIT' | 'DEBIT' | 'CREDIT_AND_DEBIT'

interface Card {
    id: number
    guid: string
    name: string
    closingDay: number
    dueDay: number
    type: CardType
    description: string
    limit: number
    bankAccountId: number
    createdAt: string
    updatedAt: string
    bankAccount: BankAccount
}
