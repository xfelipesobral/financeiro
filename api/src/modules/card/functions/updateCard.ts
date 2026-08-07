import { ApiError } from '../../../utils/error'
import { CardType } from '../../../../prisma/generated/enums'
import { card } from '../service'

const CARD_TYPES: CardType[] = ['CREDIT', 'DEBIT', 'CREDIT_AND_DEBIT']

export async function updateCard(userId: number, id: number, data: UpdateCardDTO = {}) {
    const existing = await card.userFindById(userId, id)

    if (!existing) {
        throw new ApiError('CARD_NOT_FOUND', 'Cartão não encontrado', 404)
    }

    const updateData: { name?: string; closingDay?: number; dueDay?: number; type?: CardType; description?: string; limit?: number } = {}

    if (data.name !== undefined) {
        const name = data.name.trim()

        if (!name) {
            throw new ApiError('CARD_NAME_REQUIRED', 'Nome do cartão é obrigatório', 400)
        }

        updateData.name = name
    }

    if (data.closingDay !== undefined) {
        const closingDay = Number(data.closingDay)

        if (isNaN(closingDay) || closingDay < 1 || closingDay > 31) {
            throw new ApiError('INVALID_CLOSING_DAY', 'Dia de fechamento inválido (use um valor entre 1 e 31)', 400)
        }

        updateData.closingDay = closingDay
    }

    if (data.dueDay !== undefined) {
        const dueDay = Number(data.dueDay)

        if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
            throw new ApiError('INVALID_DUE_DAY', 'Dia de vencimento inválido (use um valor entre 1 e 31)', 400)
        }

        updateData.dueDay = dueDay
    }

    if (data.type !== undefined) {
        if (!CARD_TYPES.includes(data.type)) {
            throw new ApiError('INVALID_CARD_TYPE', 'Tipo de cartão inválido', 400)
        }

        updateData.type = data.type
    }

    if (data.description !== undefined) {
        updateData.description = data.description.trim()
    }

    if (data.limit !== undefined) {
        const limit = Number(data.limit)

        if (isNaN(limit) || limit < 0) {
            throw new ApiError('INVALID_CARD_LIMIT', 'Limite do cartão inválido', 400)
        }

        updateData.limit = limit
    }

    return card.updateById(id, updateData)
}

export interface UpdateCardDTO {
    name?: string
    closingDay?: number
    dueDay?: number
    type?: CardType
    description?: string
    limit?: number
}
