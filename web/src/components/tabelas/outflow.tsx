'use client'

import { useEffect, useState } from 'react'

import { transactionsList } from '@/api/transaction/list'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { brDateTime } from '@/lib/formatDate'
import { numberToReal } from '@/lib/formatNumber'

export default function Outflow() {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        transactionsList({ type: 'DEBIT' }).then((data) => {
            setTransactions(data)
        })
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Banco</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className='text-right'>Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map(({
                    id,
                    amount,
                    description,
                    date,
                    bank: {
                        name: bankName
                    },
                    category: {
                        description: categoryDescription
                    }
                }) => (
                    <TableRow key={id}>
                        <TableCell>{bankName}</TableCell>
                        <TableCell>{description}</TableCell>
                        <TableCell>{categoryDescription}</TableCell>
                        <TableCell>{brDateTime(date)}</TableCell>
                        <TableCell className='text-right'>{numberToReal(Number(amount))}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}