'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiRemoveCard from '@/api/card/remove'

interface Params {
    card?: Card | null
    closed: (update?: boolean) => void
}

export function DeleteCard({ card, closed }: Params) {
    const open = !!card

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [card])

    const onDelete = async () => {
        if (!card) return

        setLoading(true)

        const response = await apiRemoveCard(card.id)

        if (response.success) {
            toast.success('Cartão excluído com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir cartão. Tente novamente mais tarde.')
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
                    <DialogTitle>Excluir cartão</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <p className="text-sm">
                    Tem certeza que deseja excluir o cartão <strong>{card?.name}</strong>?
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir cartão
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
