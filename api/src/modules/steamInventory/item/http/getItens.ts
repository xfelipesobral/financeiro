import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../../utils/error'
import { steamInventoryItem } from '../service'
import { steamInventoryItemPriceHistory } from '../../itemPriceHistory/service'
import { steamInventoryItemTransaction } from '../../itemTransaction/service'
import { CATEGORY_BOUGHT_STEAM_ITEM, CATEGORY_SOLD_STEAM_ITEM } from '../../constants'

export async function getItens(request: FastifyRequest, reply: FastifyReply) {
    try {
        const itens = await steamInventoryItem.userFindMany(request.authenticated!.userId)

        const formattedItens: Item[] = []

        const marketUrls: string[] = []
        const itemIds: number[] = []

        for (const item of itens) {
            if (item.marketUrl) {
                marketUrls.push(item.marketUrl)
            }

            itemIds.push(item.id)
        }

        // Buscar os últimos preços para os itens com marketUrl
        const lastPrices = await steamInventoryItemPriceHistory.findLastPricesByMarketUrls(marketUrls)
        const lastPriceMap = new Map(lastPrices.map((p) => [p.marketUrl, p.priceSteam.toNumber()]))

        // Average prices
        const averagePrices = await steamInventoryItemTransaction.averagePriceByItemIdsMap(itemIds)

        for (const { id, name, description, marketUrl, imageUrl, color, quantity, lastPaidPrice, lastSoldPrice } of itens) {
            const purchased = averagePrices.get(`${id}-${CATEGORY_BOUGHT_STEAM_ITEM}`)
            const sold = averagePrices.get(`${id}-${CATEGORY_SOLD_STEAM_ITEM}`)

            const formattedItem: Item = {
                id,
                name,
                description,
                marketUrl: marketUrl || '',
                imageUrl: imageUrl || '',
                color: color || '#ffffff',
                quantity: quantity,
                lastPaidPrice: lastPaidPrice?.toNumber() ?? null,
                lastSoldPrice: lastSoldPrice?.toNumber() ?? null,
                lastPrice: 0,
                averagePaidPrice: purchased?.averagePrice ?? 0,
                averageSoldPrice: sold?.averagePrice ?? 0,
                quantityBought: purchased?.totalQuantity ?? 0,
                quantitySold: sold?.totalQuantity ?? 0,
            }

            if (formattedItem.imageUrl && !formattedItem.imageUrl.startsWith('http')) {
                formattedItem.imageUrl = `https://steamcommunity-a.akamaihd.net/economy/image/${formattedItem.imageUrl}`
            }

            if (formattedItem.color && !formattedItem.color.startsWith('#')) {
                formattedItem.color = `#${formattedItem.color}`
            }

            if (formattedItem.marketUrl) {
                formattedItem.lastPrice = lastPriceMap.get(formattedItem.marketUrl) ?? 0
            }

            formattedItens.push(formattedItem)
        }

        reply.status(200).send(formattedItens)
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
