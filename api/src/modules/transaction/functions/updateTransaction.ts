import { ApiError } from '../../../utils/error'
import { bankAccount } from '../../bankAccount/service'
import { category } from '../../category/service'
import { transaction } from '../service'

export async function updateTransaction(userId: number, id: number, data: UpdateTransactionDTO = {}) {
    const existing = await transaction.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('TRANSACTION_NOT_FOUND', 'Transaction not found.', 404)
    }

    const updateData: { bankAccountId?: number; categoryId?: number; totalAmount?: number; description?: string; date?: Date } = {}

    if (data.bankAccountId !== undefined) {
        const bankAccountId = Number(data.bankAccountId)

        if (!data.bankAccountId || isNaN(bankAccountId)) {
            throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Bank account is required.', 400)
        }

        const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

        if (!bankAccountFinded) {
            throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Bank account not found.', 404)
        }

        updateData.bankAccountId = bankAccountId
    }

    if (data.categoryId !== undefined) {
        const categoryId = Number(data.categoryId)

        if (!data.categoryId || isNaN(categoryId)) {
            throw new ApiError('CATEGORY_ID_REQUIRED', 'Category is required.', 400)
        }

        const categoryFinded = await category.findById(categoryId, userId)

        if (!categoryFinded) {
            throw new ApiError('CATEGORY_NOT_FOUND', 'Category not found.', 404)
        }

        updateData.categoryId = categoryId
    }

    if (data.totalAmount !== undefined) {
        const totalAmount = Number(data.totalAmount)

        if (isNaN(totalAmount) || totalAmount <= 0) {
            throw new ApiError('INVALID_TRANSACTION_AMOUNT', 'Transaction amount must be greater than zero.', 400)
        }

        updateData.totalAmount = totalAmount
    }

    if (data.description !== undefined) {
        const description = data.description.trim()

        if (!description) {
            throw new ApiError('TRANSACTION_DESCRIPTION_REQUIRED', 'Transaction description is required.', 400)
        }

        updateData.description = description
    }

    if (data.date !== undefined) {
        const date = new Date(data.date)

        if (isNaN(date.getTime())) {
            throw new ApiError('INVALID_TRANSACTION_DATE', 'Transaction date is invalid.', 400)
        }

        updateData.date = date
    }

    return transaction.updateById(id, updateData)
}

export interface UpdateTransactionDTO {
    bankAccountId?: number
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: string
}
