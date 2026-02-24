import { prisma } from '../../../../db'

export default class SteamInventoryItemRepository {
    private steamInventoryItem = prisma.steamInventoryItem

    findMany() {
        return this.steamInventoryItem.findMany()
    }

    findById(id: number) {
        return this.steamInventoryItem.findUnique({
            where: { id },
        })
    }
}
