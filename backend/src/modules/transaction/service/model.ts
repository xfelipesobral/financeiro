import { Transaction } from '@prisma/client'

export interface UpsertTransactionParams {
    id?: string
    amount: number
    bankId: number
    categoryId: number
    date: Date
    description: string
    userId: string
}

export interface TransactionFunctionsModel {
    findById(id: string): Promise<Transaction | null>
    delete(id: string): Promise<void>
    upsert(transaction: UpsertTransactionParams): Promise<Transaction>
}

export interface TransactionFunctionsService {
}