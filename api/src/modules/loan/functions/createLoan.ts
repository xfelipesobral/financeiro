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
import { calculateFixedPaymentSchedule } from '../../../utils/calculateFixedPaymentSchedule'

// Categoria fixa seedada para representar empréstimos (ver api/src/db/seed.ts).
const LOAN_CATEGORY_ID = 55 // 'Empréstimo'

export async function createLoan(userId: number, data: CreateLoanDTO = {}) {
    const bankAccountId = Number(data.bankAccountId)
    const description = data.description?.trim()
    const principal = data.totalAmount === undefined ? NaN : Number(data.totalAmount)
    const dueDay = data.dueDay === undefined ? NaN : Number(data.dueDay)
    const interestRate = data.interestRate === undefined || data.interestRate === null ? null : Number(data.interestRate) // Taxa de juros mensal
    const startDate = data.startDate === undefined ? new Date() : new Date(data.startDate)
    const desiredMonthlyPayment =
        data.desiredMonthlyPayment === undefined || data.desiredMonthlyPayment === null ? null : Number(data.desiredMonthlyPayment) // Valor desejado para cada parcela (com juros compostos sobre o saldo devedor). Se informado, `installmentTotal` é ignorado.

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Conta bancária é obrigatória', 400)
    }

    if (!description) {
        throw new ApiError('LOAN_DESCRIPTION_REQUIRED', 'Descrição do empréstimo é obrigatória', 400)
    }

    if (isNaN(principal) || principal <= 0) {
        throw new ApiError('INVALID_LOAN_AMOUNT', 'Valor do empréstimo inválido', 400)
    }

    if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
        throw new ApiError('INVALID_DUE_DAY', 'Dia de vencimento inválido (use um valor entre 1 e 31)', 400)
    }

    if (interestRate !== null && (isNaN(interestRate) || interestRate < 0)) {
        throw new ApiError('INVALID_INTEREST_RATE', 'Taxa de juros inválida', 400)
    }

    if (desiredMonthlyPayment !== null && (isNaN(desiredMonthlyPayment) || desiredMonthlyPayment <= 0)) {
        throw new ApiError('INVALID_DESIRED_MONTHLY_PAYMENT', 'Pagamento mensal desejado inválido', 400)
    }

    if (isNaN(startDate.getTime())) {
        throw new ApiError('INVALID_START_DATE', 'Data inicial inválida', 400)
    }

    // Duas formas de definir as parcelas:
    // - `desiredMonthlyPayment` informado: parcelas de valor fixo até quitar a dívida (com juros
    //   compostos sobre o saldo devedor), última parcela menor. O nº de parcelas é calculado aqui,
    //   não vem do cliente.
    // - Caso contrário: `installmentTotal` fixo, valor dividido igualmente entre as parcelas
    //   (comportamento antigo, sem aplicar juros).
    let amounts: number[]
    let installmentTotal: number

    if (desiredMonthlyPayment !== null) {
        const schedule = calculateFixedPaymentSchedule(principal, interestRate ?? 0, desiredMonthlyPayment)

        if (!schedule.ok) {
            throw new ApiError(
                'INSUFFICIENT_MONTHLY_PAYMENT',
                'Esse pagamento mensal não cobre nem os juros do primeiro mês, a dívida nunca seria quitada',
                400,
            )
        }

        amounts = schedule.amounts
        installmentTotal = amounts.length
    } else {
        installmentTotal = data.installmentTotal === undefined ? NaN : Number(data.installmentTotal)

        if (isNaN(installmentTotal) || installmentTotal < 1 || !Number.isInteger(installmentTotal)) {
            throw new ApiError('INVALID_INSTALLMENT_TOTAL', 'Número de parcelas inválido', 400)
        }

        amounts = splitAmountIntoInstallments(principal, installmentTotal)
    }

    // totalAmount sempre reflete o que de fato será pago (soma das parcelas): sem juros aplicados
    // (installmentTotal fixo) isso é igual ao principal; com `desiredMonthlyPayment`, já inclui os
    // juros compostos ao longo do tempo.
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0)

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
    }

    const loanCategory = await category.findById(LOAN_CATEGORY_ID, userId)

    if (!loanCategory) {
        throw new ApiError('LOAN_CATEGORY_NOT_CONFIGURED', 'Categoria padrão de empréstimo não configurada', 500)
    }

    const loanPaymentMethod = await paymentMethod.findByGuid(PAYMENT_METHOD_GUID.LOAN)

    if (!loanPaymentMethod) {
        throw new ApiError('LOAN_PAYMENT_METHOD_NOT_CONFIGURED', 'Forma de pagamento padrão de empréstimo não configurada', 500)
    }

    const dueDates = calculateMonthlyDueDates(startDate, dueDay, installmentTotal)

    const createdLoan = await loan.create({
        userId,
        bankAccountId,
        description,
        totalAmount,
        installmentTotal,
        dueDay,
        interestRate,
        startDate,
    })

    const createdTransaction = await transaction.create(
        userId,
        bankAccountId,
        LOAN_CATEGORY_ID,
        totalAmount,
        description,
        startDate,
        installmentTotal > 1 ? installmentTotal : null,
    )

    await Promise.all(
        amounts.map((amount, index) =>
            payment.create({
                userId,
                paymentMethodId: loanPaymentMethod.id,
                transactionId: createdTransaction.id,
                loanId: createdLoan.id,
                amount,
                installmentNumber: index + 1,
                status: 'PENDING',
                dueDate: dueDates[index],
                paidAt: null,
            }),
        ),
    )

    return createdLoan
}

export interface CreateLoanDTO {
    bankAccountId?: number
    description?: string
    totalAmount?: number
    installmentTotal?: number
    dueDay?: number
    interestRate?: number | null
    desiredMonthlyPayment?: number | null
    startDate?: string
}
