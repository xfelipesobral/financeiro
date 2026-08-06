'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiRemoveTransaction from '@/api/transaction/remove'

interface Params {
    transaction?: Transaction | null
    closed: (update?: boolean) => void
}

export function DeleteTransaction({ transaction, closed }: Params) {
    const open = !!transaction

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [transaction])

    const onDelete = async () => {
        if (!transaction) return

        setLoading(true)

        const response = await apiRemoveTransaction(transaction.id)

        if (response.success) {
            toast.success('Lançamento excluído com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir lançamento. Tente novamente mais tarde.')
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
                    <DialogTitle>Excluir lançamento</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <p className="text-sm">
                    Tem certeza que deseja excluir o lançamento <strong>{transaction?.description}</strong>?
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir lançamento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
