import { CATEGORY_BOUGHT_STEAM_ITEM } from '../../constants'
import { saveTransaction } from '../../itemTransaction/functions/saveTransaction'
import { steamInventoryItem } from '../service'

export async function upsertItem(userId: number, item: UpsertItemDTO) {
    if (!item.steamId) {
        throw new Error('Steam ID is required to upsert an item.')
    }

    let currentItem = null

    if (item.id) {
        currentItem = await steamInventoryItem.findById(item.id)
    } else {
        currentItem = await steamInventoryItem.findBySteamId(item.steamId)
    }

    if (currentItem) {
        await steamInventoryItem.updateById(currentItem.id, {
            name: item.name,
            description: item.description,
            marketUrl: item.marketUrl,
            imageUrl: item.imageUrl,
            color: item.color,
        })
    } else {
        currentItem = await steamInventoryItem.create(
            userId,
            item.steamId,
            item.name || '',
            item.description || '',
            item.marketUrl,
            item.imageUrl,
            item.color,
        )
    }

    if (item.quantity > 0) {
        await saveTransaction({
            itemId: currentItem.id,
            categoryId: CATEGORY_BOUGHT_STEAM_ITEM,
            quantity: item.quantity,
            unitPrice: item.paidPrice,
            observation: 'Importação de inventário',
            userId,
            findLastPrice: true,
        })
    }

    return currentItem
}

export interface UpsertItemDTO {
    id?: number
    steamId: string
    name?: string
    description?: string
    marketUrl?: string
    imageUrl?: string
    color?: string
    paidPrice?: number
    quantity: number
}
