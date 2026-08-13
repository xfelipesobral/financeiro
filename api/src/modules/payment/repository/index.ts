import { prisma, Prisma } from '../../../db'
import { PaymentStatus } from '../../../../prisma/generated/enums'
import { uuid } from '../../../utils/uuid'
import { startOfDay } from '../../../utils/calculateMonthlyDueDates'

export interface CreatePaymentData {
    userId: number
    paymentMethodId: number
    transactionId: number
    cardId?: number | null
    loanId?: number | null
    amount: number
    installmentNumber?: number | null
    description?: string | null
    status: PaymentStatus
    dueDate: Date
    paidAt?: Date | null
}

export interface UpdatePaymentData {
    status?: PaymentStatus
    dueDate?: Date
    paidAt?: Date | null
}

export class PaymentRepository {
    private payment = prisma.payment

    findManyByTransactionId(transactionId: number) {
        return this.payment.findMany({
            where: { transactionId },
            orderBy: { installmentNumber: 'asc' },
        })
    }

    findManyByLoanId(loanId: number) {
        return this.payment.findMany({
            where: { loanId },
            orderBy: { installmentNumber: 'asc' },
        })
    }

    userFindById(userId: number, id: number) {
        return this.payment.findFirst({
            where: { id, userId },
        })
    }

    create(data: CreatePaymentData) {
        return this.payment.create({
            data: {
                guid: uuid(),
                ...data,
                dueDate: startOfDay(data.dueDate),
            },
        })
    }

    updateById(id: number, data: UpdatePaymentData) {
        return this.payment.update({
            where: { id },
            data: {
                ...data,
                dueDate: data.dueDate !== undefined ? startOfDay(data.dueDate) : undefined,
            },
        })
    }

    deleteMany(where: Prisma.PaymentWhereInput) {
        return this.payment.deleteMany({ where })
    }

    deleteByTransactionId(transactionId: number) {
        return this.payment.deleteMany({
            where: { transactionId },
        })
    }

    userFindManyPending(userId: number) {
        return this.payment.findMany({
            where: { userId, status: 'PENDING' },
            include: {
                transaction: { select: { id: true, description: true } },
            },
            orderBy: { dueDate: 'asc' },
        })
    }

    findManyPendingByCardIdAndDueDate(cardId: number, dueDate: Date) {
        return this.payment.findMany({
            where: { cardId, dueDate: startOfDay(dueDate), status: 'PENDING' },
            orderBy: { installmentNumber: 'asc' },
        })
    }
}
