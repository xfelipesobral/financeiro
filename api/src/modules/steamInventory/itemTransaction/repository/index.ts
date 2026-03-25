import { prisma } from '../../../../db'

export default class SteamInventoryItemTransactionRepository {
    private steamInventoryItemTransaction = prisma.steamInventoryItemTransaction

    create(data: CreateSteamInventoryItemTransactionDTO) {
        return this.steamInventoryItemTransaction.create({ data })
    }

    update(id: number, data: Partial<CreateSteamInventoryItemTransactionDTO>) {
        return this.steamInventoryItemTransaction.update({
            where: { id },
            data,
        })
    }

    delete(id: number) {
        return this.steamInventoryItemTransaction.delete({
            where: { id },
        })
    }

    findLastForCategoryByItemId(itemId: number, categoryId: number) {
        return this.steamInventoryItemTransaction.findFirst({
            where: {
                steamInventoryItemId: itemId,
                categoryId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    userFindById(userId: number, transactionId: number) {
        return this.steamInventoryItemTransaction.findFirst({
            where: {
                id: transactionId,
                steamInventoryItem: {
                    userId,
                },
            },
        })
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

    averagePriceByItemIds(itemIds: number[]) {
        return this.steamInventoryItemTransaction.groupBy({
            by: ['steamInventoryItemId', 'categoryId'],
            where: { steamInventoryItemId: { in: itemIds } },
            _avg: { unitPrice: true },
            _sum: { quantity: true },
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
