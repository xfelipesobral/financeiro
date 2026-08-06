'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiRemoveLoan from '@/api/loan/remove'

interface Params {
    loan?: Loan | null
    closed: (update?: boolean) => void
}

export function DeleteLoan({ loan, closed }: Params) {
    const open = !!loan

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [loan])

    const onDelete = async () => {
        if (!loan) return

        setLoading(true)

        const response = await apiRemoveLoan(loan.id)

        if (response.success) {
            toast.success('Empréstimo excluído com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir empréstimo. Tente novamente mais tarde.')
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
                    <DialogTitle>Excluir empréstimo</DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita. Só é possível excluir empréstimos sem nenhuma parcela paga.
                    </DialogDescription>
                </DialogHeader>

                <p className="text-sm">
                    Tem certeza que deseja excluir o empréstimo <strong>{loan?.description}</strong>?
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir empréstimo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
