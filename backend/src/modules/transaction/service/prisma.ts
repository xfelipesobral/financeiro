import { Prisma, PrismaClient, Transaction } from '@prisma/client'

import { uuid } from '../../../utils/uuid'

import { TransactionFunctionsModel, UpsertTransactionParams } from './model'

export class TransactionModel implements TransactionFunctionsModel {
    private prisma = new PrismaClient().transaction

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