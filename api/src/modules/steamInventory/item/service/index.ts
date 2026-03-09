import { CATEGORY_BOUGHT_STEAM_ITEM, CATEGORY_SOLD_STEAM_ITEM } from '../../constants'
import { steamInventoryItemTransaction } from '../../itemTransaction/service'
import Repository from '../repository'

class Service extends Repository {
    applyTransaction(id: number, categoryId: number, quantity: number, unitPrice?: number | null) {
        if (categoryId === CATEGORY_BOUGHT_STEAM_ITEM) {
            return this.updateLastTransaction(id, quantity, unitPrice, undefined)
        }

        if (categoryId === CATEGORY_SOLD_STEAM_ITEM) {
            return this.updateLastTransaction(id, -quantity, undefined, unitPrice)
        }

        throw new Error(`Unknown categoryId: ${categoryId}`)
    }

    async revertTransaction(id: number, categoryId: number, quantity: number) {
        const lastTransactionForCategory = await steamInventoryItemTransaction.findLastForCategoryByItemId(id, categoryId)

        if (categoryId === CATEGORY_BOUGHT_STEAM_ITEM) {
            return this.updateLastTransaction(id, -quantity, lastTransactionForCategory?.unitPrice.toNumber() ?? null, undefined)
        }

        if (categoryId === CATEGORY_SOLD_STEAM_ITEM) {
            return this.updateLastTransaction(id, quantity, undefined, lastTransactionForCategory?.unitPrice.toNumber() ?? null)
        }

        throw new Error(`Unknown categoryId: ${categoryId}`)
    }
}

export const steamInventoryItem = new Service()
