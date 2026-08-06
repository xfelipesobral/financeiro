'use client'

import { AddSteamItem } from '@/components/steam/addSteamItem'
import { ImportSteamInventory } from '@/components/steam/importSteamInventory'
import { SteamItens } from '@/components/steam/itens'
import { SubTitle, Title } from '@/components/title'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, Plus } from 'lucide-react'
import { useState } from 'react'

export default function InventarioSteamPage() {
    const [importSteamInventoryOpen, setImportSteamInventoryOpen] = useState(false)
    const [addSteamItemOpen, setAddSteamItemOpen] = useState(false)

    return (
        <div className="p-4">
            <AddSteamItem
                open={addSteamItemOpen}
                closed={(reload = false) => {
                    setAddSteamItemOpen(false)

                    if (reload) {
                        location.reload()
                    }
                }}
            />

            <ImportSteamInventory
                open={importSteamInventoryOpen}
                closed={(reload = false) => {
                    setImportSteamInventoryOpen(false)

                    // Recarrega a página
                    if (reload) {
                        location.reload()
                    }
                }}
            />

            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <Title>Inventário Steam</Title>
                    <SubTitle>Gerencie seus itens do Steam</SubTitle>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => setAddSteamItemOpen(true)}>
                        <Plus /> Adicionar Item
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setImportSteamInventoryOpen(true)}>Importar</DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="mt-4">
                <SteamItens />
            </div>
        </div>
    )
}
