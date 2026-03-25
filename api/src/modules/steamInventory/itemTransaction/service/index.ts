import Repository from '../repository'

class Service extends Repository {
    async averagePriceByItemIdsMap(itemIds: number[]) {
        const avareges = await this.averagePriceByItemIds(itemIds)

        const avaregeMap = new Map<string, { averagePrice: number; totalQuantity: number }>()

        for (const avarege of avareges) {
            const key = `${avarege.steamInventoryItemId}-${avarege.categoryId}`
            avaregeMap.set(key, {
                averagePrice: avarege._avg.unitPrice?.toNumber() ?? 0,
                totalQuantity: avarege._sum.quantity ?? 0,
            })
        }

        return avaregeMap
    }
}

export const steamInventoryItemTransaction = new Service()
