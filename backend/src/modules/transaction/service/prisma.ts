import { Prisma, Transaction } from '@prisma/client'
import { prisma } from '../../db'

import { uuid } from '../../../utils/uuid'

import { TransactionFilterFindParams, TransactionFunctionsModel, UpsertTransactionParams } from './model'

export class TransactionModel implements TransactionFunctionsModel {
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
                bank: true
            },
            orderBy: {
                date: 'asc'
            }
        })
    }

    findById(id: string): Promise<Transaction | null> {
        return this.prisma.findUnique({
            where: {
                id
            },
            include: {
                category: true,
                bank: true
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

    upsert({ id, amount, bankId, userId, categoryId, date, description }: UpsertTransactionParams): Promise<Transaction> {
        if (!id) id = uuid()

        const prismaAmount = new Prisma.Decimal(amount)

        return this.prisma.upsert({
            where: {
                id
            },
            update: {
                amount: prismaAmount,
                bankId,
                date,
                description
            },
            create: {
                id,
                amount: prismaAmount,
                userId,
                bankId,
                date,
                description,
                categoryId,
            }
        })
    }
}