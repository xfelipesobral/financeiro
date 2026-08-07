'use client'

import { ArrowLeftRight, ChevronLeft, ChevronRight, Pencil, Receipt, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Params {
    transactions: Transaction[]
    loading: boolean
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onEdit: (transaction: Transaction) => void
    onDelete: (transaction: Transaction) => void
    onDeleteTransfer: (transaction: Transaction) => void
    onViewPayments: (transaction: Transaction) => void
}

export function TransactionsList({
    transactions,
    loading,
    page,
    pageSize,
    total,
    onPageChange,
    onEdit,
    onDelete,
    onDeleteTransfer,
    onViewPayments,
}: Params) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    if (!loading && !transactions.length) {
        return <p className="text-sm text-muted-foreground">Nenhum lançamento encontrado para os filtros selecionados.</p>
    }

    return (
        <div className="grid gap-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Conta</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => {
                        const isCredit = transaction.category.type === 'CREDIT'
                        const payments = transaction.payments || []
                        const firstPayment = payments[0]
                        const paidCount = payments.filter((payment) => payment.status === 'PAID').length
                        const isInstallment = payments.length > 1

                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {new Date(transaction.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    <Badge variant={isCredit ? 'default' : 'destructive'}>{transaction.category.description}</Badge>
                                </TableCell>
                                <TableCell>
                                    {firstPayment?.card ? (
                                        `Cartão · ${firstPayment.card.name}`
                                    ) : (
                                        <>
                                            {transaction.bankAccount.bank.name} ·{' '}
                                            {transaction.bankAccount.description || transaction.bankAccount.accountNumber}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Badge variant={transaction.status === 'PAID' ? 'default' : 'secondary'}>
                                            {transaction.status === 'PAID' ? 'Pago' : 'Pendente'}
                                        </Badge>
                                        {isInstallment && (
                                            <span className="text-xs text-muted-foreground">
                                                {paidCount}/{payments.length} parcelas pagas
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className={isCredit ? 'text-green-700' : 'text-red-600'}>
                                    {isCredit ? '+' : '-'}
                                    {transaction.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" title="Ver pagamentos" onClick={() => onViewPayments(transaction)}>
                                        <Receipt />
                                    </Button>
                                    {transaction.transferId ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Excluir transferência"
                                            onClick={() => onDeleteTransfer(transaction)}>
                                            <ArrowLeftRight />
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                                                <Pencil />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                                                <Trash2 />
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {total} lançamento{total === 1 ? '' : 's'} · página {page} de {totalPages}
                </p>

                <div className="flex gap-2">
                    <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}
