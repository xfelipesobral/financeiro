'use client'

import apiGetSteamItemTransactions, { ApiSteamItemTransaction } from '@/api/steam/transactions/getItemTransactions'
import { useItemDetails } from './context'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function SteamItemDetailsTransactions() {
    const { id } = useItemDetails()

    const [transactions, setTransactions] = useState<ApiSteamItemTransaction[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        setLoading(true)

        const response = await apiGetSteamItemTransactions(id)

        if (response.success && response.data) {
            setTransactions(response.data.transactions)
        } else {
            toast.error(response.message || 'Erro ao buscar transações do item. Tente novamente mais tarde.')
        }

        setLoading(false)
    }

    return (
        <div className="grid gap-4">
            <h2 className="text-xl font-bold">Transações recentes</h2>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Transação</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Anotação</TableHead>
                            <TableHead className="text-right">Valor unitário</TableHead>
                            <TableHead className="text-right">Quantidade</TableHead>
                            <TableHead className="text-right">Criado em</TableHead>
                            <TableHead className="text-right">Alterado em</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.id}</TableCell>
                                <TableCell>{transaction.totalAmount}</TableCell>
                                <TableCell>{transaction.categoryId}</TableCell>
                                <TableCell>{transaction.observation || ''}</TableCell>
                                <TableCell className="text-right">{transaction.unitPrice}</TableCell>
                                <TableCell className="text-right">{transaction.quantity}</TableCell>
                                <TableCell className="text-right">{transaction.createdAt}</TableCell>
                                <TableCell className="text-right">{transaction.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
