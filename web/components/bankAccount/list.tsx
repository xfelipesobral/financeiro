'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'

import apiGetBankAccounts from '@/api/bankAccount/list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Params {
    onEdit: (bankAccount: BankAccount) => void
    onDelete: (bankAccount: BankAccount) => void
}

export function BankAccountsList({ onEdit, onDelete }: Params) {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBankAccounts()
    }, [])

    const fetchBankAccounts = async () => {
        setLoading(true)

        const response = await apiGetBankAccounts()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar contas bancárias')
            setLoading(false)
            return
        }

        setBankAccounts(response.data || [])
        setLoading(false)
    }

    if (!loading && !bankAccounts.length) {
        return <p className="text-sm text-muted-foreground">Nenhuma conta bancária cadastrada ainda.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Banco</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Agência</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead>Chaves Pix</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bankAccounts.map((bankAccount) => (
                    <TableRow key={bankAccount.id}>
                        <TableCell>{bankAccount.bank.name}</TableCell>
                        <TableCell>{bankAccount.description || '-'}</TableCell>
                        <TableCell>{bankAccount.branchCode}</TableCell>
                        <TableCell>{bankAccount.accountNumber}</TableCell>
                        <TableCell>
                            {bankAccount.pixs.length ? <Badge variant="secondary">{bankAccount.pixs.length} chave(s)</Badge> : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(bankAccount)}>
                                <Pencil />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(bankAccount)}>
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
