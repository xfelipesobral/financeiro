import { prisma } from '../../../../db'

export default class SteamInventoryItemTransactionRepository {
    private steamInventoryItemTransaction = prisma.steamInventoryItemTransaction

    create(data: CreateSteamInventoryItemTransactionDTO) {
        return this.steamInventoryItemTransaction.create({ data })
    }

    userTransactionsByItemId(userId: number, itemId: number, limit: number, offset: number, orderBy: 'asc' | 'desc' = 'desc') {
        return this.steamInventoryItemTransaction.findMany({
            where: {
                steamInventoryItemId: itemId,
                steamInventoryItem: {
                    userId,
                },
            },
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: orderBy,
            },
        })
    }

    userTransactionsCountByItemId(userId: number, itemId: number) {
        return this.steamInventoryItemTransaction.count({
            where: {
                steamInventoryItemId: itemId,
                steamInventoryItem: {
                    userId,
                },
            },
        })
    }
}

interface CreateSteamInventoryItemTransactionDTO {
    steamInventoryItemId: number
    observation?: string
    unitPrice: number
    quantity: number
    totalAmount: number
    categoryId: number
}
