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
    const dueDay = data.dueDay === undefined ? NaN : Number(data.dueDay)
    const limit = data.limit === undefined ? NaN : Number(data.limit)

    if (!data.bankAccountId || isNaN(bankAccountId)) {
        throw new ApiError('BANK_ACCOUNT_ID_REQUIRED', 'Conta bancária é obrigatória', 400)
    }

    if (!name) {
        throw new ApiError('CARD_NAME_REQUIRED', 'Nome do cartão é obrigatório', 400)
    }

    if (isNaN(closingDay) || closingDay < 1 || closingDay > 31) {
        throw new ApiError('INVALID_CLOSING_DAY', 'Dia de fechamento inválido (use um valor entre 1 e 31)', 400)
    }

    if (isNaN(dueDay) || dueDay < 1 || dueDay > 31) {
        throw new ApiError('INVALID_DUE_DAY', 'Dia de vencimento inválido (use um valor entre 1 e 31)', 400)
    }

    if (!data.type || !CARD_TYPES.includes(data.type)) {
        throw new ApiError('INVALID_CARD_TYPE', 'Tipo de cartão inválido', 400)
    }

    if (isNaN(limit) || limit < 0) {
        throw new ApiError('INVALID_CARD_LIMIT', 'Limite do cartão inválido', 400)
    }

    const bankAccountFinded = await bankAccount.userFindById(userId, bankAccountId)

    if (!bankAccountFinded) {
        throw new ApiError('BANK_ACCOUNT_NOT_FOUND', 'Conta bancária não encontrada', 404)
    }

    return card.create(bankAccountId, name, closingDay, dueDay, data.type, description, limit)
}

export interface CreateCardDTO {
    bankAccountId?: number
    name?: string
    closingDay?: number
    dueDay?: number
    type?: CardType
    description?: string
    limit?: number
}
