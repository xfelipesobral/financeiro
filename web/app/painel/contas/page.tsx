'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import apiGetBanks from '@/api/bank/list'
import { BankAccountFormDialog } from '@/components/bankAccount/bankAccountFormDialog'
import { DeleteBankAccount } from '@/components/bankAccount/deleteBankAccount'
import { BankAccountsList } from '@/components/bankAccount/list'
import { SubTitle, Title } from '@/components/title'
import { Button } from '@/components/ui/button'

export default function ContasBancariasPage() {
    const [banks, setBanks] = useState<Bank[]>([])
    const [formOpen, setFormOpen] = useState(false)
    const [editingBankAccount, setEditingBankAccount] = useState<BankAccount | null>(null)
    const [deletingBankAccount, setDeletingBankAccount] = useState<BankAccount | null>(null)

    useEffect(() => {
        fetchBanks()
    }, [])

    const fetchBanks = async () => {
        const response = await apiGetBanks()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar bancos')
            return
        }

        setBanks(response.data || [])
    }

    return (
        <div className="p-4">
            <BankAccountFormDialog
                open={formOpen || !!editingBankAccount}
                banks={banks}
                bankAccount={editingBankAccount}
                closed={(reload = false) => {
                    setFormOpen(false)
                    setEditingBankAccount(null)

                    if (reload) {
                        location.reload()
                    }
                }}
            />

            <DeleteBankAccount
                bankAccount={deletingBankAccount}
                closed={(reload = false) => {
                    setDeletingBankAccount(null)

                    if (reload) {
                        location.reload()
                    }
                }}
            />

            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <Title>Contas Bancárias</Title>
                    <SubTitle>Cadastre suas contas, agências e chaves Pix</SubTitle>
                </div>

                <Button onClick={() => setFormOpen(true)}>
                    <Plus /> Nova conta
                </Button>
            </div>

            <div className="mt-4">
                <BankAccountsList onEdit={setEditingBankAccount} onDelete={setDeletingBankAccount} />
            </div>
        </div>
    )
}
