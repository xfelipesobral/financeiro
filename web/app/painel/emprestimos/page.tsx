'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import apiGetBankAccounts from '@/api/bankAccount/list'
import apiGetLoans from '@/api/loan/list'
import { DeleteLoan } from '@/components/loan/deleteLoan'
import { LoansList } from '@/components/loan/list'
import { LoanFormDialog } from '@/components/loan/loanFormDialog'
import { SettleInstallmentsDialog } from '@/components/loan/settleInstallmentsDialog'
import { SubTitle, Title } from '@/components/title'
import { Button } from '@/components/ui/button'

export default function EmprestimosPage() {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const [loans, setLoans] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
    const [formOpen, setFormOpen] = useState(false)
    const [editingLoan, setEditingLoan] = useState<Loan | null>(null)
    const [deletingLoan, setDeletingLoan] = useState<Loan | null>(null)
    const [settlingLoan, setSettlingLoan] = useState<Loan | null>(null)

    useEffect(() => {
        fetchBankAccounts()
        fetchLoans()
    }, [])

    const fetchBankAccounts = async () => {
        const response = await apiGetBankAccounts()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar contas bancárias')
            return
        }

        setBankAccounts(response.data || [])
    }

    const fetchLoans = async () => {
        setLoading(true)

        const response = await apiGetLoans()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar empréstimos')
            setLoading(false)
            return
        }

        setLoans(response.data || [])
        setLoading(false)
    }

    return (
        <div className="p-4">
            <LoanFormDialog
                open={formOpen || !!editingLoan}
                bankAccounts={bankAccounts}
                loan={editingLoan}
                closed={(reload = false) => {
                    setFormOpen(false)
                    setEditingLoan(null)

                    if (reload) {
                        fetchLoans()
                    }
                }}
            />

            <DeleteLoan
                loan={deletingLoan}
                closed={(reload = false) => {
                    setDeletingLoan(null)

                    if (reload) {
                        fetchLoans()
                    }
                }}
            />

            <SettleInstallmentsDialog
                loan={settlingLoan}
                bankAccounts={bankAccounts}
                closed={(reload = false) => {
                    setSettlingLoan(null)

                    if (reload) {
                        fetchLoans()
                    }
                }}
            />

            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <Title>Empréstimos</Title>
                    <SubTitle>Cadastre empréstimos e acompanhe as parcelas pendentes</SubTitle>
                </div>

                <Button
                    onClick={() => {
                        if (!bankAccounts.length) {
                            toast.error('Cadastre uma conta bancária antes de adicionar um empréstimo.')
                            return
                        }

                        setFormOpen(true)
                    }}>
                    <Plus /> Novo empréstimo
                </Button>
            </div>

            <div className="mt-4">
                <LoansList loans={loans} loading={loading} onEdit={setEditingLoan} onDelete={setDeletingLoan} onSettle={setSettlingLoan} />
            </div>
        </div>
    )
}
