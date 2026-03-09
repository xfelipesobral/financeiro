'use client'

import apiGetSteamItemTransactions, { ApiSteamItemTransaction } from '@/api/steam/transactions/getItemTransactions'
import { useItemDetails } from './context'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { numberToBrl } from '@/lib/formatNumber'
import { Badge } from '@/components/ui/badge'
import { brDateTime } from '@/lib/formatDate'
import { SectionTitle } from '@/components/title'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical } from 'lucide-react'
import { UpsertSteamItemTransaction } from './upsertTransaction'
import { DeleteSteamItemTransaction } from './deleteTransaction'

const TRANSACTIONS_PER_PAGE = 10

export function SteamItemDetailsTransactions() {
    const { id } = useItemDetails()

    const [transactions, setTransactions] = useState<ApiSteamItemTransaction[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<ApiSteamItemTransaction | null>(null)
    const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null)
    const [totalItens, setTotalItems] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)

    useEffect(() => {
        fetchTransactions(currentPage)
    }, [currentPage])

    const fetchTransactions = async (page: number) => {
        setLoading(true)

        const response = await apiGetSteamItemTransactions(id, TRANSACTIONS_PER_PAGE, (page - 1) * TRANSACTIONS_PER_PAGE)

        if (response.success && response.data) {
            setTransactions(response.data.transactions)
            if (page === 1) setTotalItems(response.data.total)
            if (page !== currentPage) setCurrentPage(page)
        } else {
            toast.error(response.message || 'Erro ao buscar transações do item. Tente novamente mais tarde.')
        }

        setLoading(false)
    }

    const totalPages = totalItens === 0 ? 1 : Math.ceil(totalItens / TRANSACTIONS_PER_PAGE)

    return (
        <div className="grid gap-4">
            <UpsertSteamItemTransaction
                transaction={selectedTransaction}
                closed={(update) => {
                    setSelectedTransaction(null)
                    if (update) fetchTransactions(1)
                }}
            />
            <DeleteSteamItemTransaction
                transactionId={deleteTransactionId}
                closed={(update) => {
                    setDeleteTransactionId(null)
                    if (update) fetchTransactions(1)
                }}
            />

            <div className="flex items-center justify-between gap-2">
                <SectionTitle>Transações recentes</SectionTitle>
                <Button
                    onClick={() =>
                        setSelectedTransaction({
                            id: 0,
                            createdAt: '',
                            observation: '',
                            quantity: 0,
                            totalAmount: '',
                            unitPrice: '',
                            updatedAt: '',
                            type: 'BOUGHT',
                        })
                    }>
                    Adicionar Transação
                </Button>
            </div>

            <div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-25">Transação</TableHead>
                                <TableHead className="text-right">Valor unitário</TableHead>
                                <TableHead className="text-right">Quantidade</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Anotação</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Última atualização</TableHead>
                                <TableHead className="w-25"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">{transaction.id}</TableCell>
                                    <TableCell className="text-right">{numberToBrl(transaction.unitPrice)}</TableCell>
                                    <TableCell className="text-right">{transaction.quantity}</TableCell>
                                    <TableCell>
                                        {transaction.type === 'BOUGHT' ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Compra
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                Venda
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{transaction.observation || ''}</TableCell>
                                    <TableCell>{numberToBrl(transaction.totalAmount)}</TableCell>
                                    <TableCell className="text-right">{brDateTime(transaction.updatedAt)}</TableCell>
                                    <TableCell className="flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <EllipsisVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem onClick={() => setSelectedTransaction(transaction)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteTransactionId(transaction.id)}>
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex lg:justify-end items-center mt-2 gap-4">
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            <span className="sr-only">Ir para a primeira página</span>
                            <ChevronsLeft />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
                            <span className="sr-only">Ir para a página anterior</span>
                            <ChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}>
                            <span className="sr-only">Ir para a próxima página</span>
                            <ChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}>
                            <span className="sr-only">Ir para a última página</span>
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
