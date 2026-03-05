import { prisma } from '../../../../db'

export default class SteamInventoryItemPriceHistoryRepository {
    private steamInventoryItemPriceHistory = prisma.steamInventoryItemPriceHistory

    findLastPriceByMarketUrl(marketUrl: string) {
        return this.steamInventoryItemPriceHistory.findFirst({
            where: { marketUrl },
            orderBy: { recordedAt: 'desc' },
        })
    }

    findTodayPriceByMarketUrl(marketUrl: string) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return this.steamInventoryItemPriceHistory.findFirst({
            where: {
                marketUrl,
                recordedAt: {
                    gte: today,
                },
            },
            orderBy: { recordedAt: 'desc' },
        })
    }

    create(marketUrl: string, priceSteam: number, priceTradeIt: number) {
        return this.steamInventoryItemPriceHistory.create({
            data: {
                marketUrl,
                priceSteam,
                priceTradeIt,
            },
        })
    }
}
