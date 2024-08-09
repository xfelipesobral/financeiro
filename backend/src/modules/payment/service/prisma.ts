import { Payment, Prisma } from '@prisma/client';
import { PaymentFilterFindParams, PaymentFunctionsModel, PaymentUpsert } from './model'
import { prisma } from '../../db';
import { uuid } from '../../../utils/uuid';

export class PaymentModel implements PaymentFunctionsModel {
    private prisma = prisma.payment

    findById(id: string): Promise<Payment | null> {
        return this.prisma.findUnique({
            where: {
                id
            }
        })
    }

    findByUserId(userId: string, filters: PaymentFilterFindParams): Promise<Payment[]> {
        throw new Error('Method not implemented.')
    }

    async delete(id: string): Promise<void> {
        await this.prisma.delete({
            where: {
                id
            }
        })
    }

    upsert({ amount, date, description, id, cardId, userId, transactionId, paymentMethodId }: PaymentUpsert): Promise<Payment> {
        if (!id) id = uuid()

        const prismaAmount = new Prisma.Decimal(amount)

        return this.prisma.upsert({
            where: {
                id
            },
            update: {
                amount: prismaAmount,
                date,
                description,
                cardId,
                userId,
                transactionId,
                paymentMethodId
            },
            create: {
                amount: prismaAmount,
                date,
                description,
                cardId,
                userId,
                transactionId,
                paymentMethodId
            }
        })
    }

    findByTransactionId(transactionId: string): Promise<Payment[]> {
        return this.prisma.findMany({
            where: {
                transactionId
            }
        })
    }

    async totalByTransactionId(transactionId: string): Promise<number> {
        const result = await this.prisma.aggregate({
            _sum: {
                amount: true
            },
            where: {
                transactionId
            }
        })

        return Number(result._sum.amount) || 0
    }

}