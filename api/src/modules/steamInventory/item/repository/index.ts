import { prisma } from '../../../../db'
import { uuid } from '../../../../utils/uuid'
import { CATEGORY_BOUGHT_STEAM_ITEM, CATEGORY_SOLD_STEAM_ITEM } from '../../constants'

export default class SteamInventoryItemRepository {
    private steamInventoryItem = prisma.steamInventoryItem
    private steamInventoryItemTransaction = prisma.steamInventoryItemTransaction

    findMany() {
        return this.steamInventoryItem.findMany()
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

    applyInventoryMoviment(id: number, quantity: number, unitPrice: number, categoryId: number) {
        return this.steamInventoryItem.update({
            where: { id },
            data: {
                quantity: {
                    increment: quantity * (categoryId === CATEGORY_BOUGHT_STEAM_ITEM ? 1 : -1),
                },
                lastPaidPrice: categoryId === CATEGORY_BOUGHT_STEAM_ITEM ? unitPrice : undefined,
                lastSoldPrice: categoryId === CATEGORY_SOLD_STEAM_ITEM ? unitPrice : undefined,
            },
        })
    }

    async deleteAll() {
        await this.steamInventoryItemTransaction.deleteMany()
        await this.steamInventoryItem.deleteMany()
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
