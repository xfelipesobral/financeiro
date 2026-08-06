import { ApiError } from '../../../utils/error'
import { prisma } from '../../../db'
import { bankAccount } from '../../bankAccount/service'
import { category } from '../../category/service'
import { paymentMethod } from '../../paymentMethod/service'
import { PAYMENT_METHOD_GUID } from '../../paymentMethod/constants'
import { payment } from '../../payment/service'
import { transaction } from '../../transaction/service'
import { loan } from '../service'
import { calculateMonthlyDueDates } from '../../../utils/calculateMonthlyDueDates'
import { splitAmountIntoInstallments } from '../../../utils/splitAmountIntoInstallments'

// Categoria fixa seedada para representar empréstimos (ver api/src/db/seed.ts).
const LOAN_CATEGORY_ID = 55 // 'Empréstimo'

export async function createLoan(userId: number, data: CreateLoanDTO = {}) {
    const bankAccountId = Number(data.bankAccountId)
    const description = data.description?.trim()
    const totalAmount = data.totalAmount === undefined ? NaN : Number(data.totalAmount)
    const installmentTotal = data.installmentTotal === undefined ? NaN : Number(data.installmentTotal)
    const dueDay = data.dueDay === undefined ? NaN : Number(data.dueDay)
    const interestRate = data.interestRate === undefined || data.interestRate === null ? null : Number(data.interestRate)
    const startDate = data.startDate === undefined ? new Date() : new Date(data.startDate)

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Bank account is required.', 400)
    }

    if (!description) {
        throw new ApiError('LOAN_DESCRIPTION_REQUIRED', 'Loan description is required.', 400)
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new ApiError('INVALID_LOAN_AMOUNT', 'Loan amount must be greater than zero.', 400)
    }

    if (isNaN(installmentTotal) || installmentTotal < 1 || !Number.isInteger(installmentTotal)) {
        throw new ApiError('INVALID_INSTALLMENT_TOTAL', 'Installment total must be an integer greater than or equal to 1.', 400)
    }

    if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
        throw new ApiError('INVALID_DUE_DAY', 'Due day must be between 1 and 31.', 400)
    }

    if (interestRate !== null && (isNaN(interestRate) || interestRate < 0)) {
        throw new ApiError('INVALID_INTEREST_RATE', 'Interest rate must be greater than or equal to zero.', 400)
    }

    if (isNaN(startDate.getTime())) {
        throw new ApiError('INVALID_START_DATE', 'Start date is invalid.', 400)
    }

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Bank account not found.', 404)
    }

    const loanCategory = await category.findById(LOAN_CATEGORY_ID, userId)

    if (!loanCategory) {
        throw new ApiError('LOAN_CATEGORY_NOT_CONFIGURED', 'Default loan category is not configured.', 500)
    }

    const loanPaymentMethod = await paymentMethod.findByGuid(PAYMENT_METHOD_GUID.LOAN)

    if (!loanPaymentMethod) {
        throw new ApiError('LOAN_PAYMENT_METHOD_NOT_CONFIGURED', 'Default loan payment method is not configured.', 500)
    }

    const dueDates = calculateMonthlyDueDates(startDate, dueDay, installmentTotal)
    const amounts = splitAmountIntoInstallments(totalAmount, installmentTotal)

    return prisma.$transaction(async (tx) => {
        const createdTransaction = await transaction.create(
            userId,
            bankAccountId,
            LOAN_CATEGORY_ID,
            totalAmount,
            description,
            startDate,
            installmentTotal > 1 ? installmentTotal : null,
            tx,
        )

        const createdLoan = await loan.create(
            {
                userId,
                bankAccountId,
                description,
                totalAmount,
                installmentTotal,
                dueDay,
                interestRate,
                startDate,
            },
            tx,
        )

        await Promise.all(
            amounts.map((amount, index) =>
                payment.create(
                    {
                        userId,
                        paymentMethodId: loanPaymentMethod.id,
                        transactionId: createdTransaction.id,
                        loanId: createdLoan.id,
                        amount,
                        installmentNumber: index + 1,
                        status: 'PENDING',
                        dueDate: dueDates[index],
                        paidAt: null,
                    },
                    tx,
                ),
            ),
        )

        return (await loan.userFindById(userId, createdLoan.id, tx))!
    })
}

export interface CreateLoanDTO {
    bankAccountId?: number
    description?: string
    totalAmount?: number
    installmentTotal?: number
    dueDay?: number
    interestRate?: number | null
    startDate?: string
}
