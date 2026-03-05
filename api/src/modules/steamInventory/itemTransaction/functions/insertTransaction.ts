import { steamInventoryItem } from '../../item/service'
import { getPriceByItemId } from '../../itemPriceHistory/functions/getPriceByItemId'
import { steamInventoryItemTransaction } from '../service'

export async function insertItemTransaction(itemId: number, categoryId: number, quantity: number, unitPrice?: number, observation?: string) {
    const currentItem = await steamInventoryItem.findById(itemId)

    if (!currentItem) {
        throw new Error('Item not found')
    }

    if (quantity <= 0) {
        throw new Error('Quantity must be greater than zero')
    }

    if (!unitPrice || unitPrice <= 0) {
        unitPrice = await getPriceByItemId(itemId)
    }

    const totalPrice = unitPrice * quantity

    const currentTransaction = await steamInventoryItemTransaction.create({
        steamInventoryItemId: itemId,
        categoryId,
        quantity,
        unitPrice,
        totalAmount: totalPrice,
        observation,
    })

    // atualiza a raiz do item com a nova quantidade e preço pago/vendido
    await steamInventoryItem.applyInventoryMoviment(itemId, quantity, unitPrice, categoryId)

    return currentTransaction
}
