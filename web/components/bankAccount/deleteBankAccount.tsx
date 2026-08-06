'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import apiRemoveBankAccount from '@/api/bankAccount/remove'

interface Params {
    bankAccount?: BankAccount | null
    closed: (update?: boolean) => void
}

export function DeleteBankAccount({ bankAccount, closed }: Params) {
    const open = !!bankAccount

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [bankAccount])

    const onDelete = async () => {
        if (!bankAccount) return

        setLoading(true)

        const response = await apiRemoveBankAccount(bankAccount.id)

        if (response.success) {
            toast.success('Conta bancária excluída com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao excluir conta bancária. Tente novamente mais tarde.')
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
                    <DialogTitle>Excluir conta bancária</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <p className="text-sm">
                    Tem certeza que deseja excluir a conta <strong>{bankAccount?.description || bankAccount?.accountNumber}</strong>? Contas com
                    cartões ou lançamentos vinculados não podem ser excluídas.
                </p>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onDelete} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        Excluir conta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
