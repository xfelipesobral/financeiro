import { steamInventoryItem } from '../service'
import { upsertItem, UpsertItemDTO } from './upsertItem'

export async function importCs2Inventory(userId: number, inventory: IntegrationSteamInventoryResponse) {
    // Limpa todos os itens do inventário antes de importar os novos
    await steamInventoryItem.deleteAll()

    let itensForInsert: Map<string, UpsertItemDTO> = new Map()

    for (const item of inventory.assets) {
        const steamId = `${item.classid}_${item.instanceid}`
        const currentItem = itensForInsert.get(steamId)

        if (currentItem) {
            currentItem.quantity += 1
            continue // Se o item já existe, apenas incrementa a quantidade e continua para o próximo
        }

        const assetDescription = inventory.descriptions.find(
            (descriptionItem) => `${descriptionItem.classid}_${descriptionItem.instanceid}` === steamId,
        )

        if (!assetDescription) {
            continue // Se não encontrar os detalhes do item, pula para o próximo
        }

        const categoryType = assetDescription.tags.find((tag) => tag.category === 'Type')

        if (categoryType && ignoreTagsType.includes(categoryType.internal_name)) {
            continue // Ignora itens com tags de tipo específicas
        }

        const description = assetDescription.descriptions.find((desc) => desc.name === 'description')?.value || ''

        itensForInsert.set(steamId, {
            steamId,
            name: assetDescription.name,
            description,
            marketUrl: assetDescription.market_hash_name,
            imageUrl: assetDescription.icon_url,
            color: assetDescription.name_color,
            quantity: 1,
        })
    }

    for (const item of itensForInsert.values()) {
        await upsertItem(userId, item)
    }
}

const ignoreTagsType = ['CSGO_Type_Collectible', 'CSGO_Type_C4', 'CSGO_Type_Spray', 'CSGO_Type_Tool']
