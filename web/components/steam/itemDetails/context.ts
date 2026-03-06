import { ApiSteamInventoryItemDetails } from '@/api/steam/itens/getItem'
import { createContext, useContext } from 'react'

export interface ItemDetailsProvider extends ApiSteamInventoryItemDetails {}

export const ItemDetailsContext = createContext<ItemDetailsProvider | null>(null)

export function useItemDetails() {
    const context = useContext(ItemDetailsContext)

    if (!context) {
        throw new Error('useItemsDetails must be used within an ItemDetailsProvider')
    }

    return context
}
