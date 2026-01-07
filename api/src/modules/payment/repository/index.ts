import { Payment, Prisma } from '../../../../prisma/generated/client'
import { prisma } from '../../db'

interface PaymentFilterFindParams {
    initialDate?: Date
    finalDate?: Date
    bankId?: number
    categoryId?: number
    take?: number
    skip?: number
}

interface PaymentUpsert {
    id?: number
    userId: number
    paymentMethodId: number
    transactionId: number
    cardId?: number
    amount: number
    description: string
    date: Date
}

export class PaymentRepository {
    private prisma = prisma.payment

    findById(id: number): Promise<Payment | null> {
        return this.prisma.findUnique({
            where: {
                id,
            },
        })
    }

    findByUserId(userId: string, filters: PaymentFilterFindParams): Promise<Payment[]> {
        throw new Error('Method not implemented.')
    }

    async delete(id: number): Promise<void> {
        await this.prisma.delete({
            where: {
                id,
            },
        })
    }

    upsert({ amount, date, description, id, cardId, userId, transactionId, paymentMethodId }: PaymentUpsert): Promise<Payment> {
        const prismaAmount = new Prisma.Decimal(amount)

        return this.prisma.upsert({
            where: {
                id,
            },
            update: {
                amount: prismaAmount,
                date,
                description,
                cardId,
                userId,
                transactionId,
                paymentMethodId,
            },
            create: {
                id,
                amount: prismaAmount,
                date,
                description,
                cardId,
                userId,
                transactionId,
                paymentMethodId,
            },
        })
    }

    findByTransactionId(transactionId: number): Promise<Payment[]> {
        return this.prisma.findMany({
            where: {
                transactionId,
            },
        })
    }

    async totalByTransactionId(transactionId: number): Promise<number> {
        const result = await this.prisma.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                transactionId,
            },
        })

        return Number(result._sum.amount) || 0
    }
}
