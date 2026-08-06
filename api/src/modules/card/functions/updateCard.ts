import { ApiError } from '../../../utils/error'
import { CardType } from '../../../../prisma/generated/enums'
import { card } from '../service'

const CARD_TYPES: CardType[] = ['CREDIT', 'DEBIT', 'CREDIT_AND_DEBIT']

export async function updateCard(userId: number, id: number, data: UpdateCardDTO = {}) {
    const existing = await card.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('CARD_NOT_FOUND', 'Card not found.', 404)
    }

    const updateData: { name?: string; closingDay?: number; type?: CardType; description?: string; limit?: number } = {}

    if (data.name !== undefined) {
        const name = data.name.trim()

        if (!name) {
            throw new ApiError('CARD_NAME_REQUIRED', 'Card name is required.', 400)
        }

        updateData.name = name
    }

    if (data.closingDay !== undefined) {
        const closingDay = Number(data.closingDay)

        if (isNaN(closingDay) || closingDay < 1 || closingDay > 31) {
            throw new ApiError('INVALID_CLOSING_DAY', 'Closing day must be between 1 and 31.', 400)
        }

        updateData.closingDay = closingDay
    }

    if (data.type !== undefined) {
        if (!CARD_TYPES.includes(data.type)) {
            throw new ApiError('INVALID_CARD_TYPE', 'Card type must be CREDIT, DEBIT or CREDIT_AND_DEBIT.', 400)
        }

        updateData.type = data.type
    }

    if (data.description !== undefined) {
        updateData.description = data.description.trim()
    }

    if (data.limit !== undefined) {
        const limit = Number(data.limit)

        if (isNaN(limit) || limit < 0) {
            throw new ApiError('INVALID_CARD_LIMIT', 'Card limit must be greater than or equal to zero.', 400)
        }

        updateData.limit = limit
    }

    return card.updateById(id, updateData)
}

export interface UpdateCardDTO {
    name?: string
    closingDay?: number
    type?: CardType
    description?: string
    limit?: number
}
