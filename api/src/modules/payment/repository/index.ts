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

    // Todos os Payments PENDING do usuário — base de dados do dashboard "Contas a pagar". Inclui só a
    // descrição da transação original (rótulo de fallback); card/loan completos já são buscados à
    // parte pelo front (GET /card, GET /loan) para exibição/seleção de conta.
    userFindManyPending(userId: number) {
        return this.payment.findMany({
            where: { userId, status: 'PENDING' },
            include: {
                transaction: { select: { id: true, description: true } },
            },
            orderBy: { dueDate: 'asc' },
        })
    }

    // Parcelas PENDING de uma fatura específica: mesmo cardId + mesmo dueDate exato. Todas as
    // parcelas de um cartão que vencem no mesmo mês compartilham o mesmo dueDate (calculado a partir
    // de card.closingDay, ver calculateMonthlyDueDates/buildTransactionPayments), então isso é o
    // suficiente para identificar "a fatura".
    findManyPendingByCardIdAndDueDate(cardId: number, dueDate: Date) {
        return this.payment.findMany({
            where: { cardId, dueDate, status: 'PENDING' },
            orderBy: { installmentNumber: 'asc' },
        })
    }
}
