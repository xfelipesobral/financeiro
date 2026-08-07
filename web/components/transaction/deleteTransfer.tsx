'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiRemoveTransfer from '@/api/transfer/remove'

interface Params {
    // A transação de qualquer uma das duas pernas — usamos `transaction.transferId` para excluir a
    // transferência inteira (as duas pernas somem juntas).
    transaction?: Transaction | null
    closed: (update?: boolean) => void
}

export function DeleteTransfer({ transaction, closed }: Params) {
    const open = !!transaction

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [transaction])

    const onDelete = async () => {
        if (!transaction?.transferId) return

        setLoading(true)

        const response = await apiRemoveTransfer(transaction.transferId)

        if (response.success) {
            toast.success('Transferência excluída com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir transferência. Tente novamente mais tarde.')
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
                    <DialogTitle>Excluir transferência</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita e remove as duas pernas da transferência.</DialogDescription>
                </DialogHeader>

                <p className="text-sm">
                    Tem certeza que deseja excluir a transferência <strong>{transaction?.description}</strong>?
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir transferência
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
