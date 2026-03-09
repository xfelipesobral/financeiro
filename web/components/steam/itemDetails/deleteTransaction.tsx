'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiDeleteSteamItemTransaction from '@/api/steam/transactions/deleteItemTransaction'

interface Params {
    transactionId?: number | null
    closed: (update?: boolean) => void
}

export function DeleteSteamItemTransaction({ transactionId, closed }: Params) {
    const open = (transactionId && transactionId !== null) || false

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [transactionId])

    const onDeleteTransaction = async () => {
        if (!transactionId) return

        setLoading(true)

        const response = await apiDeleteSteamItemTransaction(transactionId)

        if (response.success) {
            toast.success('Transação excluída com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir transação. Tente novamente mais tarde.')
        }

        setLoading(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Excluir transação</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <p className="text-sm">Tem certeza que deseja excluir esta movimentação? O estoque e os preços relacionados serão revertidos.</p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDeleteTransaction} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir movimentação
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
