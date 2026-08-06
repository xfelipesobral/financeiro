import { prisma, Prisma } from '../../../db'
import { PaymentStatus } from '../../../../prisma/generated/enums'
import { uuid } from '../../../utils/uuid'

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

    create(data: CreatePaymentData, db: Prisma.TransactionClient = prisma) {
        return db.payment.create({
            data: {
                guid: uuid(),
                ...data,
            },
        })
    }

    updateById(id: number, data: UpdatePaymentData, db: Prisma.TransactionClient = prisma) {
        return db.payment.update({
            where: { id },
            data,
        })
    }

    deleteMany(where: Prisma.PaymentWhereInput, db: Prisma.TransactionClient = prisma) {
        return db.payment.deleteMany({ where })
    }
}
