'use server'

import apiGetSteamItem from '@/api/steam/itens/getItem'
import { Error } from '@/components/error'
import { SteamItemDetails } from '@/components/steam/itemDetails'
import { SubTitle, Title } from '@/components/title'
import { randomNumber } from '@/lib/randomNumber'

const backgrounds = ['mirage.webp', 'inferno.webp', 'dust2.webp']

export default async function InventoryItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    if (!id) {
        return <Error message="ID do item é obrigatório" />
    }

    const item = await apiGetSteamItem(id)

    if (!item.success || !item.data) {
        return <Error message={item.message || 'Erro desconhecido'} />
    }

    return (
        <div className="p-4">
            <SteamItemDetails data={item.data} backgroundItemImage={backgrounds[randomNumber(0, 2)]} />
        </div>
    )
}
