import { ApiError } from '../../../utils/error'
import { bankAccount } from '../../bankAccount/service'
import { category } from '../../category/service'
import { paymentMethod } from '../../paymentMethod/service'
import { PAYMENT_METHOD_GUID } from '../../paymentMethod/constants'
import { payment } from '../../payment/service'
import { transaction } from '../../transaction/service'
import { loan } from '../service'
import { LOAN_SETTLEMENT_CATEGORY_ID } from '../constants'

export async function settleLoanInstallments(userId: number, loanId: number, data: SettleLoanInstallmentsDTO = {}) {
    const existing = await loan.userFindById(userId, loanId)

    if (!existing) {
        throw new ApiError('LOAN_NOT_FOUND', 'Empréstimo não encontrado', 404)
    }

    const bankAccountId = Number(data.bankAccountId)

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Conta bancária é obrigatória', 400)
    }

    if (!Array.isArray(data.installments) || !data.installments.length) {
        throw new ApiError('INSTALLMENTS_REQUIRED', 'Selecione ao menos uma parcela', 400)
    }

    const paymentIds = data.installments.map((installment) => Number(installment.paymentId))

    if (paymentIds.some((id) => isNaN(id))) {
        throw new ApiError('INVALID_INSTALLMENT_ID', 'Parcela inválida', 400)
    }

    if (new Set(paymentIds).size !== paymentIds.length) {
        throw new ApiError('DUPLICATE_INSTALLMENT', 'Parcela informada mais de uma vez', 400)
    }

    // Valida tudo antes de disparar qualquer atualização (mesmo espírito de createLoan.ts: falha
    // rápido se algo estiver errado, sem deixar parcelas baixadas pela metade).
    const resolved = data.installments.map((installment) => {
        const existingPayment = existing.payments.find((currentPayment) => currentPayment.id === Number(installment.paymentId))

        if (!existingPayment) {
            throw new ApiError('INSTALLMENT_NOT_FOUND', 'Parcela não encontrada neste empréstimo', 404)
        }

        if (existingPayment.status !== 'PENDING') {
            throw new ApiError('INSTALLMENT_NOT_PENDING', 'Apenas parcelas pendentes podem ser marcadas como pagas', 400)
        }

        const paidAt = installment.paidAt ? new Date(installment.paidAt) : new Date(existingPayment.dueDate)

        if (isNaN(paidAt.getTime())) {
            throw new ApiError('INVALID_PAID_AT', 'Data de baixa inválida', 400)
        }

        return { id: existingPayment.id, amount: existingPayment.amount.toNumber(), paidAt }
    })

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
    }

    const settlementCategory = await category.findById(LOAN_SETTLEMENT_CATEGORY_ID, userId)

    if (!settlementCategory) {
        throw new ApiError('LOAN_SETTLEMENT_CATEGORY_NOT_CONFIGURED', 'Categoria padrão de desconto de empréstimo não configurada', 500)
    }

    const debitPaymentMethod = await paymentMethod.findByGuid(PAYMENT_METHOD_GUID.DEBIT)

    if (!debitPaymentMethod) {
        throw new ApiError('DEBIT_PAYMENT_METHOD_NOT_CONFIGURED', 'Forma de pagamento padrão de débito não configurada', 500)
    }

    await Promise.all(resolved.map(({ id, paidAt }) => payment.updateById(id, { status: 'PAID', paidAt })))

    // Débito real na conta escolhida, referente à soma das parcelas baixadas agora. Sem cardId no
    // Payment: entra normalmente no cálculo de saldo da conta bancária.
    const totalAmount = resolved.reduce((sum, { amount }) => sum + amount, 0)
    const settlementDate = new Date()
    const description = `Baixa de parcela(s) - ${existing.description}`

    const createdTransaction = await transaction.create(
        userId,
        bankAccountId,
        LOAN_SETTLEMENT_CATEGORY_ID,
        totalAmount,
        description,
        settlementDate,
        null,
    )

    await payment.create({
        userId,
        paymentMethodId: debitPaymentMethod.id,
        transactionId: createdTransaction.id,
        amount: totalAmount,
        status: 'PAID',
        dueDate: settlementDate,
        paidAt: settlementDate,
    })

    return (await loan.userFindById(userId, loanId))!
}

export interface SettleLoanInstallmentsDTO {
    bankAccountId?: number
    installments?: { paymentId: number; paidAt?: string }[]
}
