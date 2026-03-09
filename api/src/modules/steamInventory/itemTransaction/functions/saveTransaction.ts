import { steamInventoryItemTransaction } from '../service'
import { CATEGORY_BOUGHT_STEAM_ITEM, CATEGORY_SOLD_STEAM_ITEM } from '../../constants'
import { steamInventoryItem } from '../../item/service'
import { getPriceByItemId } from '../../itemPriceHistory/functions/getPriceByItemId'

interface SaveTransactionParams {
    itemId: number
    categoryId: number
    quantity: number
    unitPrice?: number
    observation?: string
    id?: number
    findLastPrice?: boolean
    userId: number
}

export async function saveTransaction({ itemId, categoryId, quantity, unitPrice, observation, findLastPrice, id, userId }: SaveTransactionParams) {
    if (!Number.isInteger(itemId) || itemId < 1) {
        throw new Error('Item ID must be a positive integer.')
    }

    if (categoryId !== CATEGORY_BOUGHT_STEAM_ITEM && categoryId !== CATEGORY_SOLD_STEAM_ITEM) {
        throw new Error('Invalid category ID.')
    }

    if (quantity === undefined || isNaN(quantity) || quantity <= 0) {
        throw new Error('Quantity must be a positive number.')
    }

    if (unitPrice === undefined || isNaN(unitPrice) || unitPrice <= 0) {
        if (!findLastPrice) {
            throw new Error('Unit price must be a positive number.')
        } else {
            unitPrice = await getPriceByItemId(itemId)
        }
    }

    if (observation && typeof observation !== 'string') {
        throw new Error('Observation must be a string if provided.')
    }

    const totalAmount = quantity * unitPrice

    let transaction

    if (id) {
        if (!Number.isInteger(id) || id < 1) {
            throw new Error('Transaction ID must be a positive integer.')
        }

        const existingTransaction = await steamInventoryItemTransaction.userFindById(userId, id)

        if (!existingTransaction) {
            throw new Error('Transaction not found.')
        }

        if (existingTransaction.steamInventoryItemId !== itemId) {
            throw new Error('Transaction does not belong to the specified item.')
        }

        transaction = await steamInventoryItemTransaction.update(existingTransaction.id, {
            observation,
            quantity,
            totalAmount,
            unitPrice,
        })

        quantity = quantity - existingTransaction.quantity // Calcula a diferença de quantidade para aplicar no inventário
    } else {
        const itemExists = await steamInventoryItem.userFindById(userId, itemId)

        if (!itemExists) {
            throw new Error('Item not found for the user.')
        }

        transaction = await steamInventoryItemTransaction.create({
            categoryId,
            observation,
            quantity,
            totalAmount,
            unitPrice,
            steamInventoryItemId: itemId,
        })
    }

    // Aplica o efeito da transação no inventário
    await steamInventoryItem.applyTransaction(itemId, categoryId, quantity, unitPrice)

    return transaction
}
