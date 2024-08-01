'use client'

import { useEffect, useState, ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'

import { transactionsList } from '@/api/transaction/list'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { brDate } from '@/lib/formatDate'
import { numberToReal } from '@/lib/formatNumber'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface OutflowProps {
    initialDate?: Date
    finalDate?: Date
}

export interface OutflowRef {
    reload: () => void
}

function Outflow({ finalDate, initialDate }: OutflowProps, ref: ForwardedRef<OutflowRef>) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        load()
    }, [finalDate, initialDate])

    const timeout1 = useRef<number | undefined>(undefined)

    const load = () => {
        window.clearTimeout(timeout1.current)

        timeout1.current = window.setTimeout(() => {
            transactionsList({
                type: 'DEBIT',
                initialDate: initialDate?.toJSON(),
                finalDate: finalDate?.toJSON(),
                limit: '5'
            }).then((data) => {
                setTransactions(data)
            })
        }, 100)
    }

    useImperativeHandle(ref, () => ({
        reload: load
    }))

    return (
        <div className='divide-y'>
            {
                transactions.map(({
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
                }) => {

                    return (
                        <div key={id} className='flex justify-between py-2'>
                            <div>
                                <p>{description || 'Sem descrição'}</p>
                                <p className='text-sm text-muted-foreground'>{categoryDescription}</p>
                            </div>
                            <div className='text-right'>
                                <p className='font-semibold'>{numberToReal(Number(amount))}</p>
                                <p className='text-sm text-muted-foreground capitalize'>{format(date, 'MMMM d', { locale: ptBR })}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default forwardRef(Outflow)