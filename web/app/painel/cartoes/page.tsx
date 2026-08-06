'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import apiGetBankAccounts from '@/api/bankAccount/list'
import { CardFormDialog } from '@/components/card/cardFormDialog'
import { DeleteCard } from '@/components/card/deleteCard'
import { CardsList } from '@/components/card/list'
import { SubTitle, Title } from '@/components/title'
import { Button } from '@/components/ui/button'

export default function CartoesPage() {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const [formOpen, setFormOpen] = useState(false)
    const [editingCard, setEditingCard] = useState<Card | null>(null)
    const [deletingCard, setDeletingCard] = useState<Card | null>(null)

    useEffect(() => {
        fetchBankAccounts()
    }, [])

    const fetchBankAccounts = async () => {
        const response = await apiGetBankAccounts()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar contas bancárias')
            return
        }

        setBankAccounts(response.data || [])
    }

    return (
        <div className="p-4">
            <CardFormDialog
                open={formOpen || !!editingCard}
                bankAccounts={bankAccounts}
                card={editingCard}
                closed={(reload = false) => {
                    setFormOpen(false)
                    setEditingCard(null)

                    if (reload) {
                        location.reload()
                    }
                }}
            />

            <DeleteCard
                card={deletingCard}
                closed={(reload = false) => {
                    setDeletingCard(null)

                    if (reload) {
                        location.reload()
                    }
                }}
            />

            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <Title>Cartões</Title>
                    <SubTitle>Cadastre seus cartões de crédito e débito</SubTitle>
                </div>

                <Button
                    onClick={() => {
                        if (!bankAccounts.length) {
                            toast.error('Cadastre uma conta bancária antes de adicionar um cartão.')
                            return
                        }

                        setFormOpen(true)
                    }}>
                    <Plus /> Novo cartão
                </Button>
            </div>

            <div className="mt-4">
                <CardsList onEdit={setEditingCard} onDelete={setDeletingCard} />
            </div>
        </div>
    )
}
