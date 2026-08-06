'use client'

import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'

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
}

export function TransactionsList({ transactions, loading, page, pageSize, total, onPageChange, onEdit, onDelete }: Params) {
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
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => {
                        const isCredit = transaction.category.type === 'CREDIT'

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
                                    {transaction.bankAccount.bank.name} ·{' '}
                                    {transaction.bankAccount.description || transaction.bankAccount.accountNumber}
                                </TableCell>
                                <TableCell className={isCredit ? 'text-green-700' : 'text-red-600'}>
                                    {isCredit ? '+' : '-'}
                                    {transaction.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                                        <Pencil />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                                        <Trash2 />
                                    </Button>
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
