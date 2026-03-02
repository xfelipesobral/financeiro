import { SteamInventoryItem } from '@/components/steam/steamInventoryItem'
import { SubTitle, Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function InventarioSteamPage() {
    return (
        <div className="p-4">
            <SteamInventoryItem id={null} />

            <div className="flex justify-between">
                <div className="flex-1">
                    <Title>Inventário Steam</Title>
                    <SubTitle>Gerencie seus itens do Steam</SubTitle>
                </div>
                <Button>
                    <Plus /> Adicionar Item
                </Button>
            </div>
        </div>
    )
}
