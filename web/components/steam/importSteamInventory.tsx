'use client'

import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldDescription, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CloudBackup, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiImportInventorySteam from '@/api/steam/itens/importInventory'

interface Params {
    open: boolean
    closed: (update?: boolean) => void
}

export function ImportSteamInventory({ open, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const [steamId, setSteamId] = useState('')

    useEffect(() => {
        if (!open) {
            setSteamId('')
            setLoading(false)
        }
    }, [open])

    const initImport = async () => {
        if (!steamId) {
            toast.error('Por favor, insira seu Steam64 ID para continuar a importação.')
            return
        }

        setLoading(true)

        const response = await apiImportInventorySteam(steamId)

        if (!response.success) {
            toast.error(response.message || 'Erro ao importar inventário do Steam. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success('Inventário importado com sucesso!')
        closed(true)
    }

    return (
        <Dialog open={open} onOpenChange={closed}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar Inventário</DialogTitle>
                    <DialogDescription className="text-stone-600">
                        <span className="text-red-600 underline">
                            Seus itens atuais serão apagados e substituídos pelos itens do inventário importado.
                        </span>{' '}
                        Este processo pode levar alguns minutos dependendo do tamanho do seu inventário Steam. Tenha certeza de que deseja continuar.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Field>
                        <FieldLabel htmlFor="input-demo-api-key">Steam64 ID</FieldLabel>
                        <Input id="input-demo-api-key" type="text" placeholder="..." value={steamId} onChange={(e) => setSteamId(e.target.value)} />
                        <FieldDescription>
                            Encontre seu Steam64 ID{' '}
                            <Link href="https://steamid.xyz" target="_blank">
                                clicando aqui
                            </Link>
                            .
                        </FieldDescription>
                    </Field>
                </div>

                <Button variant="destructive" onClick={initImport} disabled={loading || !steamId}>
                    {loading ? <Loader2 className="animate-spin" /> : <CloudBackup />} Importar
                </Button>
            </DialogContent>
        </Dialog>
    )
}
