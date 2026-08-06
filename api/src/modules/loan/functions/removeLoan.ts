import { ApiError } from '../../../utils/error'
import { prisma } from '../../../db'
import { payment } from '../../payment/service'
import { transaction } from '../../transaction/service'
import { loan } from '../service'

export async function removeLoan(userId: number, id: number) {
    const existing = await loan.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('LOAN_NOT_FOUND', 'Loan not found.', 404)
    }

    if (existing.payments.some((existingPayment) => existingPayment.status !== 'PENDING')) {
        throw new ApiError('LOAN_HAS_PAID_PAYMENTS', 'This loan already has paid installments and can no longer be removed.', 400)
    }

    const transactionIds = [...new Set(existing.payments.map((existingPayment) => existingPayment.transactionId))]

    await prisma.$transaction(async (tx) => {
        await payment.deleteMany({ loanId: id }, tx)

        for (const transactionId of transactionIds) {
            await transaction.deleteById(transactionId, tx)
        }

        await loan.deleteById(id, tx)
    })
}
