import { ApiError } from '../../../utils/error'
import { payment } from '../../payment/service'
import { loan } from '../service'

export async function settleLoanInstallments(userId: number, loanId: number, data: SettleLoanInstallmentsDTO = {}) {
    const existing = await loan.userFindById(userId, loanId)

    if (!existing) {
        throw new ApiError('LOAN_NOT_FOUND', 'Empréstimo não encontrado', 404)
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

        return { id: existingPayment.id, paidAt }
    })

    await Promise.all(resolved.map(({ id, paidAt }) => payment.updateById(id, { status: 'PAID', paidAt })))

    return (await loan.userFindById(userId, loanId))!
}

export interface SettleLoanInstallmentsDTO {
    installments?: { paymentId: number; paidAt?: string }[]
}
