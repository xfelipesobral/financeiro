'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiRemoveCategory from '@/api/category/remove'

interface Params {
    category?: Category | null
    closed: (update?: boolean) => void
}

export function DeleteCategoryDialog({ category, closed }: Params) {
    const open = !!category

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [category])

    const onDelete = async () => {
        if (!category) return

        setLoading(true)

        const response = await apiRemoveCategory(category.id)

        if (response.success) {
            toast.success('Categoria excluída com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir categoria. Tente novamente mais tarde.')
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
                    <DialogTitle>Excluir categoria</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <p className="text-sm">
                    Tem certeza que deseja excluir a categoria <strong>{category?.description}</strong>?
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir categoria
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
