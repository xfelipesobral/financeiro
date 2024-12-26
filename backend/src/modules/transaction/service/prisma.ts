import { CategoryType, Prisma, Transaction } from '@prisma/client'
import { prisma } from '../../db'

import { uuid } from '../../../utils/uuid'

export interface UpsertTransactionParams {
    id?: string
    amount: number
    bankAccountId: string
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

export interface TransactionSum {
    balance: number
    credit: number
    debit: number
}

export class TransactionModel {
    private prisma = prisma.transaction

    findByUserId(userId: string, { bankId, categoryId, finalDate, initialDate, type, take, skip }: TransactionFilterFindParams): Promise<Transaction[]> {
        return this.prisma.findMany({
            where: {
                userId,
                date: {
                    gte: initialDate,
                    lte: finalDate
                },
                bankId,
                categoryId,
                category: {
                    type
                }
            },
            take,
            skip,
            include: {
                category: true,
                bankAccount: true
            },
            orderBy: [{
                date: 'desc',
            }, {
                updatedAt: 'desc'
            }]
        })
    }

    findById(id: string): Promise<Transaction | null> {
        return this.prisma.findUnique({
            where: {
                id
            },
            include: {
                category: true,
                bankAccount: true
            }
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.delete({
            where: {
                id
            }
        })
    }

    upsert({ id, amount, bankAccountId, userId, categoryId, date, description }: UpsertTransactionParams): Promise<Transaction> {
        if (!id) id = uuid()

        const prismaAmount = new Prisma.Decimal(amount)

        return this.prisma.upsert({
            where: {
                id
            },
            update: {
                amount: prismaAmount,
                bankAccountId,
                date,
                description
            },
            create: {
                id,
                amount: prismaAmount,
                userId,
                bankAccountId,
                date,
                description,
                categoryId,
                balance: 0,
            }
        })
    }

    async sumByType(userId: string, type: CategoryType, filters: TransactionFilterFindParams): Promise<number> {
        const result = await this.prisma.aggregate({
            _sum: {
                amount: true
            },
            where: {
                userId,
                date: {
                    gte: filters.initialDate,
                    lte: filters.finalDate
                },
                bankId: filters.bankId,
                categoryId: filters.categoryId,
                category: {
                    type
                }
            }
        })

        return Number(result._sum.amount) || 0
    }

    async totalByUserId(userId: string, { bankId, categoryId, finalDate, initialDate, type }: TransactionFilterFindParams): Promise<TransactionSum> {
        let debit = 0
        let credit = 0

        if (type === 'DEBIT' || !type) {
            debit = await this.sumByType(userId, 'DEBIT', { bankId, categoryId, finalDate, initialDate })
        }

        if (type === 'CREDIT' || !type) {
            credit = await this.sumByType(userId, 'CREDIT', { bankId, categoryId, finalDate, initialDate })
        }

        return {
            credit,
            debit,
            balance: credit - debit
        }
    }
}