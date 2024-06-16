import { CategoryType, Transaction } from '@prisma/client'

export interface UpsertTransactionParams {
    id?: string
    amount: number
    bankId: number
    categoryId: number
    date: Date
    description: string
    userId: string
}

export interface TransactionFilterFindParams {
    initialDate?: Date
    finalDate?: Date
    bankId?: number
    categoryId?: number
    type?: CategoryType
    take?: number
    skip?: number
}

export interface TransactionFunctionsModel {
    findById(id: string): Promise<Transaction | null>
    findByUserId(userId: string, filters: TransactionFilterFindParams): Promise<Transaction[]>
    delete(id: string): Promise<void>
    upsert(transaction: UpsertTransactionParams): Promise<Transaction>
}

export interface TransactionFunctionsService {
}