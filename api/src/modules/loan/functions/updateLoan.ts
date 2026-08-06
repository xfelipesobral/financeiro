import { ApiError } from '../../../utils/error'
import { prisma } from '../../../db'
import { payment } from '../../payment/service'
import { loan } from '../service'
import { changeDayOfMonth } from '../../../utils/calculateMonthlyDueDates'

export async function updateLoan(userId: number, id: number, data: UpdateLoanDTO = {}) {
    const existing = await loan.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('LOAN_NOT_FOUND', 'Loan not found.', 404)
    }

    const updateData: { description?: string; dueDay?: number; interestRate?: number | null } = {}

    if (data.description !== undefined) {
        const description = data.description.trim()

        if (!description) {
            throw new ApiError('LOAN_DESCRIPTION_REQUIRED', 'Loan description is required.', 400)
        }

        updateData.description = description
    }

    if (data.interestRate !== undefined) {
        const interestRate = data.interestRate === null ? null : Number(data.interestRate)

        if (interestRate !== null && (isNaN(interestRate) || interestRate < 0)) {
            throw new ApiError('INVALID_INTEREST_RATE', 'Interest rate must be greater than or equal to zero.', 400)
        }

        updateData.interestRate = interestRate
    }

    let dueDay: number | undefined

    if (data.dueDay !== undefined) {
        dueDay = Number(data.dueDay)

        if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
            throw new ApiError('INVALID_DUE_DAY', 'Due day must be between 1 and 31.', 400)
        }

        updateData.dueDay = dueDay
    }

    return prisma.$transaction(async (tx) => {
        await loan.updateById(id, updateData, tx)

        // Alterar o dia de vencimento só desloca as parcelas ainda PENDING; as já PAID mantêm a data histórica.
        if (dueDay !== undefined) {
            const pendingPayments = existing.payments.filter((existingPayment) => existingPayment.status === 'PENDING')

            await Promise.all(
                pendingPayments.map((pendingPayment) =>
                    payment.updateById(pendingPayment.id, { dueDate: changeDayOfMonth(pendingPayment.dueDate, dueDay!) }, tx),
                ),
            )
        }

        return (await loan.userFindById(userId, id, tx))!
    })
}

export interface UpdateLoanDTO {
    description?: string
    dueDay?: number
    interestRate?: number | null
}
