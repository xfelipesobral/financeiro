import { steamInventoryItemTransaction } from '../service'
import { steamInventoryItem } from '../../item/service'

interface DeleteTransactionParams {
    transactionId: number
    userId: number
}

export async function deleteTransaction({ transactionId, userId }: DeleteTransactionParams) {
    if (!Number.isInteger(transactionId) || transactionId < 1) {
        throw new Error('Transaction ID must be a positive integer.')
    }

    const existingTransaction = await steamInventoryItemTransaction.userFindById(userId, transactionId)

    if (!existingTransaction) {
        throw new Error('Transaction not found.')
    }

    await steamInventoryItemTransaction.delete(existingTransaction.id)

    // Aplica o efeito da transação no inventário
    await steamInventoryItem.revertTransaction(existingTransaction.steamInventoryItemId, existingTransaction.categoryId, existingTransaction.quantity)
}
