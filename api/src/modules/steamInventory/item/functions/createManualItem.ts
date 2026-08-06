import { ApiError } from '../../../../utils/error'
import { uuid } from '../../../../utils/uuid'
import { CATEGORY_BOUGHT_STEAM_ITEM } from '../../constants'
import { steamInventoryItemPriceHistory } from '../../itemPriceHistory/service'
import { saveTransaction } from '../../itemTransaction/functions/saveTransaction'
import { steamInventoryItem } from '../service'

export async function createManualItem(userId: number, data: CreateManualItemDTO = {}) {
    const steamId = `manual:${uuid()}`
    const name = data.name?.trim()
    const imageUrl = data.imageUrl?.trim()
    const marketHashName = data.marketHashName?.trim()
    const initialPaidPrice = data.initialPaidPrice === undefined || data.initialPaidPrice === null ? null : Number(data.initialPaidPrice)

    if (!name) {
        throw new ApiError('ITEM_NAME_REQUIRED', 'Item name is required.', 400)
    }

    if (!marketHashName) {
        throw new ApiError('MARKET_HASH_NAME_REQUIRED', 'Market hash name is required.', 400)
    }

    if (!imageUrl) {
        throw new ApiError('ITEM_IMAGE_URL_REQUIRED', 'Item image URL is required.', 400)
    }

    if (!isValidHttpUrl(imageUrl)) {
        throw new ApiError('INVALID_ITEM_IMAGE_URL', 'Item image URL must be a valid HTTP URL.', 400)
    }

    if (initialPaidPrice !== null && (isNaN(initialPaidPrice) || initialPaidPrice <= 0)) {
        throw new ApiError('INVALID_INITIAL_PAID_PRICE', 'Initial paid price must be greater than zero.', 400)
    }

    const item = await steamInventoryItem.create(userId, steamId, name, '', marketHashName, imageUrl, 'ded6cc')

    await steamInventoryItemPriceHistory.create(marketHashName, initialPaidPrice ?? 0, 0)

    if (initialPaidPrice !== null) {
        await saveTransaction({
            itemId: item.id,
            categoryId: CATEGORY_BOUGHT_STEAM_ITEM,
            quantity: 1,
            unitPrice: initialPaidPrice,
            observation: 'Cadastro manual do item',
            userId,
            findLastPrice: false,
        })
    }

    return item
}

function isValidHttpUrl(value: string) {
    try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

export interface CreateManualItemDTO {
    name?: string
    marketHashName?: string
    imageUrl?: string
    initialPaidPrice?: number | null
}
