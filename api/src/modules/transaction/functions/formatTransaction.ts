import { Prisma } from '../../../../prisma/generated/client'

type TransactionWithRelations = Prisma.TransactionGetPayload<{
    include: {
        category: true
        bankAccount: { include: { bank: true } }
        payments: { include: { card: true; loan: true } }
    }
}>

export function formatTransaction(transaction: TransactionWithRelations) {
    const payments = transaction.payments.map((transactionPayment) => ({
        ...transactionPayment,
        amount: transactionPayment.amount.toNumber(),
        card: transactionPayment.card ? { ...transactionPayment.card, limit: transactionPayment.card.limit.toNumber() } : null,
        loan: transactionPayment.loan
            ? {
                  ...transactionPayment.loan,
                  totalAmount: transactionPayment.loan.totalAmount.toNumber(),
                  interestRate: transactionPayment.loan.interestRate?.toNumber() ?? null,
              }
            : null,
    }))

    const status: 'PENDING' | 'PAID' = payments.length > 0 && payments.every((p) => p.status === 'PAID') ? 'PAID' : 'PENDING'

    return {
        ...transaction,
        totalAmount: transaction.totalAmount.toNumber(),
        payments,
        status,
    }
}
