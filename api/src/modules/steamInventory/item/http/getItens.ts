import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../../utils/error'
import { steamInventoryItem } from '../service'
import { steamInventoryItemPriceHistory } from '../../itemPriceHistory/service'

export async function getItens(request: FastifyRequest, reply: FastifyReply) {
    try {
        const itens = await steamInventoryItem.userFindMany(request.authenticated!.userId)

        const formattedItens: Item[] = []

        // Buscar os últimos preços para os itens com marketUrl
        const marketUrls = itens.map((item) => item.marketUrl).filter(Boolean) as string[]
        const lastPrices = await steamInventoryItemPriceHistory.findLastPricesByMarketUrls(marketUrls)
        const lastPriceMap = new Map(lastPrices.map((p) => [p.marketUrl, p.priceSteam.toNumber()]))

        for (const { id, name, description, marketUrl, imageUrl, color, quantity, lastPaidPrice, lastSoldPrice } of itens) {
            const formattedItem: Item = {
                id,
                name,
                description,
                marketUrl: marketUrl || '',
                imageUrl: imageUrl || '',
                color: color || '#ffffff',
                quantity: quantity,
                lastPaidPrice: lastPaidPrice?.toNumber() || null,
                lastSoldPrice: lastSoldPrice?.toNumber() || null,
                lastPrice: 0,
            }

            if (formattedItem.imageUrl && !formattedItem.imageUrl.startsWith('http')) {
                formattedItem.imageUrl = `https://steamcommunity-a.akamaihd.net/economy/image/${formattedItem.imageUrl}`
            }

            if (formattedItem.color && !formattedItem.color.startsWith('#')) {
                formattedItem.color = `#${formattedItem.color}`
            }

            if (formattedItem.marketUrl) {
                formattedItem.lastPrice = lastPriceMap.get(formattedItem.marketUrl) || 0
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
}
