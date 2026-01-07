import { CategoryType, Prisma, Transaction } from '../../../../prisma/generated/client'
import { prisma } from '../../db'

export interface UpsertTransactionParams {
    id?: number
    amount: number
    bankAccountId: number
    categoryId: number
    date: Date
    description: string
    userId: number
}

export interface TransactionFilterFindParams {
    initialDate?: Date
    finalDate?: Date
    bankAccountId?: number
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

export class TransactionRepository {
    private prisma = prisma.transaction

    findByUserId(
        userId: number,
        { bankAccountId, categoryId, finalDate, initialDate, type, take, skip }: TransactionFilterFindParams
    ): Promise<Transaction[]> {
        return this.prisma.findMany({
            where: {
                userId,
                date: {
                    gte: initialDate,
                    lte: finalDate,
                },
                bankAccountId,
                categoryId,
                category: {
                    type,
                },
            },
            take,
            skip,
            include: {
                category: true,
                bankAccount: true,
            },
            orderBy: [
                {
                    date: 'desc',
                },
                {
                    updatedAt: 'desc',
                },
            ],
        })
    }

    findById(id: number): Promise<Transaction | null> {
        return this.prisma.findUnique({
            where: {
                id,
            },
            include: {
                category: true,
                bankAccount: true,
            },
        })
    }

    findByGuid(guid: string): Promise<Transaction | null> {
        return this.prisma.findFirst({
            where: {
                guid,
            },
            include: {
                category: true,
                bankAccount: true,
            },
        })
    }

    async delete(id: number): Promise<void> {
        await this.prisma.delete({
            where: {
                id,
            },
        })
    }

    upsert({ id, amount, bankAccountId, userId, categoryId, date, description }: UpsertTransactionParams): Promise<Transaction> {
        const prismaAmount = new Prisma.Decimal(amount)

        return this.prisma.upsert({
            where: {
                id,
            },
            update: {
                amount: prismaAmount,
                bankAccountId,
                date,
                description,
            },
            create: {
                id,
                amount: prismaAmount,
                userId,
                bankAccountId,
                date,
                description,
                categoryId,
            },
        })
    }

    async sumByType(userId: number, type: CategoryType, filters: TransactionFilterFindParams): Promise<number> {
        const result = await this.prisma.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                userId,
                date: {
                    gte: filters.initialDate,
                    lte: filters.finalDate,
                },
                bankAccountId: filters.bankAccountId,
                categoryId: filters.categoryId,
                category: {
                    type,
                },
            },
        })

        return Number(result._sum.amount) || 0
    }

    async totalByUserId(
        userId: number,
        { bankAccountId, categoryId, finalDate, initialDate, type }: TransactionFilterFindParams
    ): Promise<TransactionSum> {
        let debit = 0
        let credit = 0

        if (type === 'DEBIT' || !type) {
            debit = await this.sumByType(userId, 'DEBIT', { bankAccountId, categoryId, finalDate, initialDate })
        }

        if (type === 'CREDIT' || !type) {
            credit = await this.sumByType(userId, 'CREDIT', { bankAccountId, categoryId, finalDate, initialDate })
        }

        return {
            credit,
            debit,
            balance: credit - debit,
        }
    }
}
