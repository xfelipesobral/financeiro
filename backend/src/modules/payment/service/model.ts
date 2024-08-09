import { Payment } from '@prisma/client'

export interface PaymentFilterFindParams {
    initialDate?: Date
    finalDate?: Date
    bankId?: number
    categoryId?: number
    take?: number
    skip?: number
}

export interface PaymentUpsert {
    id?: string
    userId: string
    paymentMethodId: number
    transactionId: string
    cardId?: string
    amount: number
    description: string
    date: Date
}

export interface PaymentFunctionsModel {
    findById(id: string): Promise<Payment | null>
    findByUserId(userId: string, filters: PaymentFilterFindParams): Promise<Payment[]>
    delete(id: string): Promise<void>
    upsert(payment: PaymentUpsert): Promise<Payment>
    findByTransactionId(transactionId: string): Promise<Payment[]>
    totalByTransactionId(transactionId: string): Promise<number>
}

export interface PaymentFunctionsService {
}