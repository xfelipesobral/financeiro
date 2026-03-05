import { steamInventoryItem } from '../../item/service'
import { getCs2PriceByMarketUrl } from '../../integrations/steam/functions/getCs2PriceByMarketUrl'
import { steamInventoryItemPriceHistory } from '../service'

export async function getPriceByItemId(itemId: number) {
    if (!itemId) {
        throw new Error('Item ID is required')
    }

    const currentItem = await steamInventoryItem.findById(itemId)

    if (!currentItem || !currentItem.marketUrl) {
        throw new Error('Item not found or market URL is missing')
    }

    const todayPrice = await steamInventoryItemPriceHistory.findTodayPriceByMarketUrl(currentItem.marketUrl)
    let currentPrice = todayPrice?.priceSteam.toNumber() || 0

    if (currentPrice > 0) {
        return currentPrice
    }

    // Se não houver preço registrado para hoje, busca o último preço disponível
    let lastPriceSteam = 0
    try {
        lastPriceSteam = (await getCs2PriceByMarketUrl(currentItem.marketUrl)).price
    } catch {
        // Ignora erros ao buscar o preço atual do Steam Market
    }

    let lastPriceTradeIt = 0
    // Precisa implementar a função de buscar o preço no TradeIt

    await steamInventoryItemPriceHistory.create(currentItem.marketUrl, lastPriceSteam, lastPriceTradeIt)

    return lastPriceSteam
}
