import { Prisma } from '../../../../prisma/generated/client'

type TransferWithRelations = Prisma.TransferGetPayload<{
    include: {
        fromBankAccount: { include: { bank: true } }
        toBankAccount: { include: { bank: true } }
        transactions: { include: { category: true; payments: true } }
    }
}>

export function formatTransfer(transfer: TransferWithRelations) {
    return {
        ...transfer,
        amount: transfer.amount.toNumber(),
        transactions: transfer.transactions.map((transferTransaction) => ({
            ...transferTransaction,
            totalAmount: transferTransaction.totalAmount.toNumber(),
            payments: transferTransaction.payments.map((transactionPayment) => ({
                ...transactionPayment,
                amount: transactionPayment.amount.toNumber(),
            })),
        })),
    }
}
