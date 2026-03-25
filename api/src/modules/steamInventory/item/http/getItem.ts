import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../../utils/error'
import { steamInventoryItem } from '../service'
import { steamInventoryItemPriceHistory } from '../../itemPriceHistory/service'
import { formatImageUrl, formatColor } from '../functions/formatting'
import { steamInventoryItemTransaction } from '../../itemTransaction/service'
import { CATEGORY_BOUGHT_STEAM_ITEM, CATEGORY_SOLD_STEAM_ITEM } from '../../constants'

export async function getItem(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { itemId } = request.params as { itemId?: string }

        if (!itemId) {
            throw new ApiError('ITEM_ID_REQUIRED', 'Item ID is required.', 400)
        }

        const numItemId = Number(itemId)
        if (isNaN(numItemId)) {
            throw new ApiError('INVALID_ITEM_ID', 'Item ID must be a valid number.', 400)
        }

        const currentItem = await steamInventoryItem.userFindById(request.authenticated!.userId, numItemId)

        if (!currentItem) {
            throw new ApiError('ITEM_NOT_FOUND', 'Item not found.', 404)
        }

        const averagePrices = await steamInventoryItemTransaction.averagePriceByItemIdsMap([currentItem.id])
        const purchased = averagePrices.get(`${currentItem.id}-${CATEGORY_BOUGHT_STEAM_ITEM}`)
        const sold = averagePrices.get(`${currentItem.id}-${CATEGORY_SOLD_STEAM_ITEM}`)

        const item: Item = {
            id: currentItem.id,
            name: currentItem.name,
            description: currentItem.description,
            marketUrl: currentItem.marketUrl || '',
            imageUrl: formatImageUrl(currentItem.imageUrl || ''),
            color: formatColor(currentItem.color || '#ffffff'),
            quantity: currentItem.quantity,
            lastPaidPrice: currentItem.lastPaidPrice?.toNumber() ?? null,
            lastSoldPrice: currentItem.lastSoldPrice?.toNumber() ?? null,
            lastPrice: 0,
            averagePaidPrice: purchased?.averagePrice ?? 0,
            averageSoldPrice: sold?.averagePrice ?? 0,
            quantityBought: purchased?.totalQuantity ?? 0,
            quantitySold: sold?.totalQuantity ?? 0,
        }

        if (item.marketUrl) {
            const price = item?.marketUrl ? await steamInventoryItemPriceHistory.findLastPriceByMarketUrl(item.marketUrl) : null
            item.lastPrice = price?.priceSteam.toNumber() ?? 0
        }

        reply.status(200).send(item)
    } catch (error) {
        handleApiError(error, reply)
    }
}

interface Item {
    id: number
    name: string
    description: string
    marketUrl: string
    imageUrl: string
    color: string
    quantity: number
    lastPaidPrice: number | null
    lastSoldPrice: number | null
    lastPrice: number
    averagePaidPrice: number
    averageSoldPrice: number
    quantityBought: number
    quantitySold: number
}
