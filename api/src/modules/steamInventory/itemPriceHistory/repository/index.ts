import { Decimal } from '../../../../../prisma/generated/internal/prismaNamespace'
import { Prisma, prisma } from '../../../../db'

export default class SteamInventoryItemPriceHistoryRepository {
    private steamInventoryItemPriceHistory = prisma.steamInventoryItemPriceHistory

    findLastPriceByMarketUrl(marketUrl: string) {
        return this.steamInventoryItemPriceHistory.findFirst({
            where: { marketUrl },
            orderBy: { recordedAt: 'desc' },
        })
    }

    getAllLastRecorded() {
        return this.steamInventoryItemPriceHistory.groupBy({
            by: ['marketUrl'],
            _max: {
                recordedAt: true,
            },
        })
    }

    insertMany(prices: { marketUrl: string; priceSteam: number }[]) {
        return this.steamInventoryItemPriceHistory.createMany({
            data: prices,
        })
    }

    async findLastPricesByMarketUrls(marketUrls: string[]) {
        return prisma.$queryRaw<{ marketUrl: string; priceSteam: Decimal }[]>`
            SELECT DISTINCT ON ("marketUrl") "marketUrl", "priceSteam"
            FROM "SteamInventoryItemPriceHistory"
            WHERE "marketUrl" = ANY(ARRAY[${Prisma.join(marketUrls)}])
            ORDER BY "marketUrl", "recordedAt" DESC
        `
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
