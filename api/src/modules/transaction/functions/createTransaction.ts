import { ApiError } from '../../../utils/error'
import { category } from '../../category/service'
import { payment } from '../../payment/service'
import { transaction } from '../service'
import { buildTransactionPayments } from './buildTransactionPayments'

export async function createTransaction(userId: number, data: CreateTransactionDTO = {}) {
    const categoryId = Number(data.categoryId)
    const totalAmount = data.totalAmount === undefined ? NaN : Number(data.totalAmount)
    const description = data.description?.trim()

    if (!data.categoryId || isNaN(categoryId)) {
        throw new ApiError('CATEGORY_ID_REQUIRED', 'Categoria é obrigatória', 400)
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new ApiError('INVALID_TRANSACTION_AMOUNT', 'Valor do lançamento inválido', 400)
    }

    if (!description) {
        throw new ApiError('TRANSACTION_DESCRIPTION_REQUIRED', 'Descrição do lançamento é obrigatória', 400)
    }

    const date = data.date === undefined ? new Date() : new Date(data.date)

    if (isNaN(date.getTime())) {
        throw new ApiError('INVALID_TRANSACTION_DATE', 'Data e hora do lançamento inválidas', 400)
    }

    const categoryFinded = await category.findById(categoryId, userId)

    if (!categoryFinded) {
        throw new ApiError('CATEGORY_NOT_FOUND', 'Categoria não encontrada', 404)
    }

    const built = await buildTransactionPayments(userId, {
        paymentMethodId: data.paymentMethodId,
        bankAccountId: data.bankAccountId,
        cardId: data.cardId,
        installmentTotal: data.installmentTotal,
        totalAmount,
        date,
    })

    const createdTransaction = await transaction.create(
        userId,
        built.bankAccountId,
        categoryId,
        totalAmount,
        description,
        date,
        built.installmentTotal,
    )

    await Promise.all(
        built.payments.map((builtPayment) =>
            payment.create({
                userId,
                paymentMethodId: built.paymentMethodId,
                transactionId: createdTransaction.id,
                cardId: builtPayment.cardId,
                amount: builtPayment.amount,
                installmentNumber: builtPayment.installmentNumber,
                status: builtPayment.status,
                dueDate: builtPayment.dueDate,
                paidAt: builtPayment.paidAt,
            }),
        ),
    )

    return createdTransaction.guid
}

export interface CreateTransactionDTO {
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: string
    paymentMethodId?: number
    bankAccountId?: number
    cardId?: number
    installmentTotal?: number
}
