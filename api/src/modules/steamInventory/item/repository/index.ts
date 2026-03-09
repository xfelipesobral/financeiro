import { prisma } from '../../../../db'
import { uuid } from '../../../../utils/uuid'

export default class SteamInventoryItemRepository {
    private steamInventoryItem = prisma.steamInventoryItem
    private steamInventoryItemTransaction = prisma.steamInventoryItemTransaction

    findMany(filters: FindManyFilters = {}) {
        return this.steamInventoryItem.findMany({})
    }

    getAllMarketUrls() {
        return this.steamInventoryItem.findMany({
            where: {
                marketUrl: {
                    not: null,
                },
            },
            select: {
                marketUrl: true,
            },
            distinct: ['marketUrl'],
        })
    }

    userFindMany(userId: number, filters: FindManyFilters = {}) {
        return this.steamInventoryItem.findMany({
            where: {
                userId,
            },
        })
    }

    userFindById(userId: number, id: number) {
        return this.steamInventoryItem.findFirst({
            where: {
                userId,
                id,
            },
        })
    }

    findById(id: number) {
        return this.steamInventoryItem.findUnique({
            where: { id },
        })
    }

    findBySteamId(steamId: string) {
        return this.steamInventoryItem.findFirst({
            where: { steamId },
        })
    }

    create(userId: number, steamId: string, name: string, description: string, marketUrl?: string, imageUrl?: string, color?: string) {
        return this.steamInventoryItem.create({
            data: {
                userId,
                steamId,
                name,
                description,
                marketUrl,
                imageUrl,
                color,
                guid: uuid(),
            },
        })
    }

    updateById(id: number, data: UpdateData) {
        return this.steamInventoryItem.update({
            where: { id },
            data,
        })
    }

    updateBySteamId(steamId: string, data: UpdateData) {
        return this.steamInventoryItem.updateMany({
            where: {
                steamId,
            },
            data,
        })
    }

    incrementQuantity(id: number, quantity: number) {
        return this.steamInventoryItem.update({
            where: { id },
            data: {
                quantity: {
                    increment: quantity,
                },
            },
        })
    }

    async deleteAll() {
        await this.steamInventoryItemTransaction.deleteMany()
        await this.steamInventoryItem.deleteMany()
    }

    updateLastTransaction(id: number, quantity?: number | null, lastPaidPrice?: number | null, lastSoldPrice?: number | null) {
        console.log(`Alterando item ${id}, quantity ${quantity}, lastPaidPrice ${lastPaidPrice}, lastSoldPrice ${lastSoldPrice}`)

        return this.steamInventoryItem.update({
            where: { id },
            data: {
                quantity: quantity
                    ? {
                          increment: quantity,
                      }
                    : undefined,
                lastPaidPrice,
                lastSoldPrice,
            },
        })
    }
}

interface UpdateData {
    name?: string
    description?: string
    marketUrl?: string
    imageUrl?: string
    color?: string
    quantity?: number
    lastPaidPrice?: number
    lastSoldPrice?: number
}

interface FindManyFilters {}
