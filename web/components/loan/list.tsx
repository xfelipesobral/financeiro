'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CircleCheck, Loader2, Pencil, Trash2 } from 'lucide-react'

import apiPayPayment from '@/api/payment/pay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Params {
    loans: Loan[]
    loading: boolean
    onEdit: (loan: Loan) => void
    onDelete: (loan: Loan) => void
    onReload: () => void
}

export function LoansList({ loans, loading, onEdit, onDelete, onReload }: Params) {
    const [payingPaymentId, setPayingPaymentId] = useState<number | null>(null)

    if (!loading && !loans.length) {
        return <p className="text-sm text-muted-foreground">Nenhum empréstimo cadastrado ainda.</p>
    }

    const payNextInstallment = async (payment: Payment) => {
        setPayingPaymentId(payment.id)

        const response = await apiPayPayment(payment.id)

        if (!response.success) {
            toast.error(response.message || 'Erro ao dar baixa na parcela. Tente novamente mais tarde.')
            setPayingPaymentId(null)
            return
        }

        toast.success('Parcela baixada com sucesso!')
        setPayingPaymentId(null)
        onReload()
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Conta bancária</TableHead>
                    <TableHead>Valor total</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loans.map((loan) => {
                    const sortedPayments = [...loan.payments].sort((a, b) => (a.installmentNumber ?? 0) - (b.installmentNumber ?? 0))
                    const paidCount = sortedPayments.filter((payment) => payment.status === 'PAID').length
                    const allPaid = paidCount === sortedPayments.length
                    const nextPending = sortedPayments.find((payment) => payment.status === 'PENDING')

                    return (
                        <TableRow key={loan.id}>
                            <TableCell>{loan.description}</TableCell>
                            <TableCell>
                                {loan.bankAccount.bank.name} · {loan.bankAccount.description || loan.bankAccount.accountNumber}
                            </TableCell>
                            <TableCell>{loan.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell>Dia {loan.dueDay}</TableCell>
                            <TableCell>
                                <Badge variant={allPaid ? 'default' : 'secondary'}>
                                    {paidCount}/{sortedPayments.length} pagas
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {nextPending && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        title={`Dar baixa na parcela ${nextPending.installmentNumber}`}
                                        disabled={payingPaymentId === nextPending.id}
                                        onClick={() => payNextInstallment(nextPending)}>
                                        {payingPaymentId === nextPending.id ? <Loader2 className="animate-spin" /> : <CircleCheck />}
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={() => onEdit(loan)}>
                                    <Pencil />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(loan)}>
                                    <Trash2 />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
