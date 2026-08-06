import { ApiError } from '../../../utils/error'
import { CardType } from '../../../../prisma/generated/enums'
import { bankAccount } from '../../bankAccount/service'
import { card } from '../service'

const CARD_TYPES: CardType[] = ['CREDIT', 'DEBIT', 'CREDIT_AND_DEBIT']

export async function createCard(userId: number, data: CreateCardDTO = {}) {
    const bankAccountId = Number(data.bankAccountId)
    const name = data.name?.trim()
    const description = data.description?.trim() ?? ''
    const closingDay = data.closingDay === undefined ? NaN : Number(data.closingDay)
    const limit = data.limit === undefined ? NaN : Number(data.limit)

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Bank account is required.', 400)
    }

    if (!name) {
        throw new ApiError('CARD_NAME_REQUIRED', 'Card name is required.', 400)
    }

    if (isNaN(closingDay) || closingDay < 1 || closingDay > 31) {
        throw new ApiError('INVALID_CLOSING_DAY', 'Closing day must be between 1 and 31.', 400)
    }

    if (!data.type || !CARD_TYPES.includes(data.type)) {
        throw new ApiError('INVALID_CARD_TYPE', 'Card type must be CREDIT, DEBIT or CREDIT_AND_DEBIT.', 400)
    }

    if (isNaN(limit) || limit < 0) {
        throw new ApiError('INVALID_CARD_LIMIT', 'Card limit must be greater than or equal to zero.', 400)
    }

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Bank account not found.', 404)
    }

    return card.create(bankAccountId, name, closingDay, data.type, description, limit)
}

export interface CreateCardDTO {
    bankAccountId?: number
    name?: string
    closingDay?: number
    type?: CardType
    description?: string
    limit?: number
}
