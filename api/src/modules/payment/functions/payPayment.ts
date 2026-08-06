import { ApiError } from '../../../utils/error'
import { payment } from '../service'

export async function payPayment(userId: number, id: number) {
    const existing = await payment.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('PAYMENT_NOT_FOUND', 'Payment not found.', 404)
    }

    if (existing.status !== 'PENDING') {
        throw new ApiError('PAYMENT_NOT_PENDING', 'Only pending payments can be marked as paid.', 400)
    }

    return payment.updateById(id, { status: 'PAID', paidAt: new Date() })
}
