import { ApiError } from '../../../utils/error'
import { payment } from '../service'
import { transaction } from '../../transaction/service'

// Dá o aceite num lançamento de PIX/débito agendado (ver buildTransactionPayments): o Payment nasce
// PENDING quando a data é futura e fica fora do saldo da conta (sumTotalAmountByBankAccount) até
// aqui. Não serve pra fatura de cartão nem parcela de empréstimo — esses têm fluxo próprio
// (payCardInvoice/settleLoanInstallments), que além de marcar o Payment como PAID também registram o
// débito real numa nova Transaction; aqui não existe uma segunda Transaction, então é a própria
// Transaction original que tem sua `date` atualizada pra data efetiva do aceite.
//
// Sequencial (sem prisma.$transaction), mesmo padrão de settleLoanInstallments.ts/createLoan.ts.
export async function acceptScheduledPayment(userId: number, id: number, data: AcceptScheduledPaymentDTO = {}) {
    const existing = await payment.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('PAYMENT_NOT_FOUND', 'Lançamento não encontrado', 404)
    }

    if (existing.status !== 'PENDING') {
        throw new ApiError('PAYMENT_NOT_PENDING', 'Apenas lançamentos pendentes podem receber o aceite', 400)
    }

    if (existing.cardId || existing.loanId) {
        throw new ApiError(
            'PAYMENT_NOT_SCHEDULABLE',
            'Fatura de cartão e parcela de empréstimo têm fluxo próprio de pagamento/baixa',
            400,
        )
    }

    const paidAt = data.paidAt ? new Date(data.paidAt) : new Date()

    if (isNaN(paidAt.getTime())) {
        throw new ApiError('INVALID_PAID_AT', 'Data de pagamento inválida', 400)
    }

    const updatedPayment = await payment.updateById(id, { status: 'PAID', paidAt })
    await transaction.updateById(existing.transactionId, { date: paidAt })

    return updatedPayment
}

export interface AcceptScheduledPaymentDTO {
    paidAt?: string
}
