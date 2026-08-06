import { ApiError } from '../../../utils/error'
import { payment } from '../service'

export async function payPayment(userId: number, id: number) {
    const existing = await payment.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('PAYMENT_NOT_FOUND', 'Parcela não encontrada', 404)
    }

    if (existing.status !== 'PENDING') {
        throw new ApiError('PAYMENT_NOT_PENDING', 'Apenas parcelas pendentes podem ser marcadas como pagas', 400)
    }

    return payment.updateById(id, { status: 'PAID', paidAt: new Date() })
}
