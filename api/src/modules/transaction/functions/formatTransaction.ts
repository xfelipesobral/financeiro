import { Prisma } from '../../../../prisma/generated/client'

type TransactionWithRelations = Prisma.TransactionGetPayload<{
    include: { category: true; bankAccount: { include: { bank: true } } }
}>

export function formatTransaction(transaction: TransactionWithRelations) {
    return {
        ...transaction,
        totalAmount: transaction.totalAmount.toNumber(),
    }
}
