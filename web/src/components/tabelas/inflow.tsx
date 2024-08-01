'use client'

import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { transactionsList } from '@/api/transaction/list'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { brDate } from '@/lib/formatDate'
import { numberToReal } from '@/lib/formatNumber'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface InflowProps {
    initialDate?: Date
    finalDate?: Date
}

export interface InflowRef {
    reload: () => void
}

function Inflow({ initialDate, finalDate }: InflowProps, ref: ForwardedRef<InflowRef>) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        load()
    }, [initialDate, finalDate])

    const timeout1 = useRef<number | undefined>(undefined)

    const load = () => {
        window.clearTimeout(timeout1.current)

        timeout1.current = window.setTimeout(() => {
            transactionsList({
                type: 'CREDIT',
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

export default forwardRef(Inflow)