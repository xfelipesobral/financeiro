import { ApiError } from '../../../utils/error'
import { payment } from '../../payment/service'
import { transaction } from '../../transaction/service'
import { transfer } from '../service'

export async function removeTransfer(userId: number, id: number) {
    const existing = await transfer.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('TRANSFER_NOT_FOUND', 'Transferência não encontrada', 404)
    }

    const transactionIds = existing.transactions.map((existingTransaction) => existingTransaction.id)

    // Sem prisma.$transaction: a ordem abaixo é a única fonte de verdade (Payment -> Transaction ->
    // Transfer), imposta pelas FKs RESTRICT do banco (que só impedem órfãos, não decidem nada sozinhas).
    await payment.deleteMany({ transactionId: { in: transactionIds } })

    for (const transactionId of transactionIds) {
        await transaction.deleteById(transactionId)
    }

    await transfer.deleteById(id)
}
