import { ApiError } from '../../../utils/error'
import { bankAccount } from '../../bankAccount/service'
import { category } from '../../category/service'
import { transaction } from '../service'

export async function createTransaction(userId: number, data: CreateTransactionDTO = {}) {
    const bankAccountId = Number(data.bankAccountId)
    const categoryId = Number(data.categoryId)
    const totalAmount = data.totalAmount === undefined ? NaN : Number(data.totalAmount)
    const description = data.description?.trim()

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Bank account is required.', 400)
    }

    if (!data.categoryId || isNaN(categoryId)) {
        throw new ApiError('CATEGORY_ID_REQUIRED', 'Category is required.', 400)
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new ApiError('INVALID_TRANSACTION_AMOUNT', 'Transaction amount must be greater than zero.', 400)
    }

    if (!description) {
        throw new ApiError('TRANSACTION_DESCRIPTION_REQUIRED', 'Transaction description is required.', 400)
    }

    const date = data.date === undefined ? new Date() : new Date(data.date)

    if (isNaN(date.getTime())) {
        throw new ApiError('INVALID_TRANSACTION_DATE', 'Transaction date is invalid.', 400)
    }

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Bank account not found.', 404)
    }

    const categoryFinded = await category.findById(categoryId, userId)

    if (!categoryFinded) {
        throw new ApiError('CATEGORY_NOT_FOUND', 'Category not found.', 404)
    }

    return transaction.create(userId, bankAccountId, categoryId, totalAmount, description, date)
}

export interface CreateTransactionDTO {
    bankAccountId?: number
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: string
}
