'use client'

import { CircleCheck, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Params {
    loans: Loan[]
    loading: boolean
    onEdit: (loan: Loan) => void
    onDelete: (loan: Loan) => void
    onSettle: (loan: Loan) => void
}

export function LoansList({ loans, loading, onEdit, onDelete, onSettle }: Params) {
    if (!loading && !loans.length) {
        return <p className="text-sm text-muted-foreground">Nenhum empréstimo cadastrado ainda.</p>
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
                    const hasPending = sortedPayments.some((payment) => payment.status === 'PENDING')

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
                                {hasPending && (
                                    <Button variant="ghost" size="icon" title="Dar baixa em parcelas" onClick={() => onSettle(loan)}>
                                        <CircleCheck />
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
