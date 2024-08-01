'use client'

import Inflow, { InflowRef } from '@/components/tabelas/inflow'
import Outflow, { OutflowRef } from '@/components/tabelas/outflow'
import { Transaction } from '@/components/painel/transaction'
import { useEffect, useRef, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { currentMonthPeriod, currentWeekPeriod, currentYearPeriod } from '@/lib/formatDate'
import { totalTransactions } from '@/api/transaction/total'
import { numberToReal } from '@/lib/formatNumber'

function dayShift() {
    const now = new Date().getHours()
    if (now >= 0 && now < 12) {
        return 'Bom dia'
    }

    if (now >= 12 && now < 18) {
        return 'Boa tarde'
    }

    return 'Boa noite'
}

type Period = 'week' | 'month' | 'year'

function getDatesFromPeriod(period: Period) {
    if (period === 'month') return currentMonthPeriod()
    if (period === 'year') return currentYearPeriod()
    return currentWeekPeriod()
}

export default function Painel() {
    const title = `${dayShift()}, Felipe`

    const [period, setPeriod] = useState<Period>('week')
    const [transactionsTotals, setTransactionsTotals] = useState<TransactionTotals>({
        balance: 0,
        credit: 0,
        debit: 0
    })

    const timeout1 = useRef<number | undefined>(undefined)
    const inflow = useRef<InflowRef>(null)
    const outflow = useRef<OutflowRef>(null)

    useEffect(() => {
        getTotals()
    }, [period])

    const { finalDate, initialDate } = getDatesFromPeriod(period)

    const reloadData = () => {
        inflow.current?.reload()
        outflow.current?.reload()
        getTotals()
    }

    const getTotals = () => {
        window.clearTimeout(timeout1.current)

        timeout1.current = window.setTimeout(() => {
            totalTransactions({
                initialDate: initialDate?.toJSON(),
                finalDate: finalDate?.toJSON()
            }).then(setTransactionsTotals)
        }, 100)
    }

    return (
        <div className='flex-1 flex flex-col gap-6'>
            <div className='flex gap-6 justify-between'>
                <div>
                    <p className='text-3xl font-bold tracking-tight'>{title}</p>
                    <p className='text-gray-500'>Resumo da sua saúde financeira {{
                        week: 'nesta semana',
                        month: 'neste mês',
                        year: 'neste ano'
                    }[period]}</p>
                </div>

                <div className='flex gap-4 items-center'>
                    <p className='text-muted-foreground'>Estatística</p>
                    <Tabs value={period} onValueChange={i => setPeriod(i as Period)}>
                        <TabsList className='bg-gray-200'>
                            <TabsTrigger value='week'>Semanal</TabsTrigger>
                            <TabsTrigger value='month'>Mensal</TabsTrigger>
                            <TabsTrigger value='year'>Anual</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Transaction
                        reloadTransactions={reloadData}
                    />
                </div>
            </div>
            <div>
                <div className='flex gap-6'>
                    <div className='flex-1 h-fit bg-white border rounded-lg shadow-sm'>
                        <div className='flex items-center justify-between rounded-t-lg p-5 pb-2'>
                            <div>
                                <p className='font-bold text-2xl'>Entradas</p>
                                <p className='text-balance text-sm text-muted-foreground leading-relaxed'>
                                    {
                                        {
                                            week: 'Últimas entradas na semana',
                                            month: 'Últimas entradas no mês',
                                            year: 'Últimas entradas no ano'
                                        }[period]
                                    }
                                </p>
                            </div>
                            <div className='bg-green-50 p-2 rounded-lg'>
                                <p className='text-xl font-bold slashed-zero text-green-600'>{numberToReal(transactionsTotals.credit)}</p>
                            </div>
                        </div>
                        <div className='p-5 pt-0'>
                            <Inflow
                                ref={inflow}
                                initialDate={initialDate}
                                finalDate={finalDate}
                            />
                        </div>
                    </div>

                    <div className='flex-1 h-fit bg-white border rounded-lg shadow-sm'>
                        <div className='flex items-center justify-between rounded-t-lg p-5 pb-2'>
                            <div>
                                <p className='font-bold text-2xl'>Saídas</p>
                                <p className='text-balance text-sm text-muted-foreground leading-relaxed'>
                                    {
                                        {
                                            week: 'Últimas saídas na semana',
                                            month: 'Últimas saídas no mês',
                                            year: 'Últimas saídas no ano'
                                        }[period]
                                    }
                                </p>
                            </div>
                            <div className='bg-red-50 p-2 rounded-lg'>
                                <p className='text-xl font-bold text-red-600 slashed-zero '>{numberToReal(transactionsTotals.debit)}</p>
                            </div>
                        </div>
                        <div className='p-5 pt-0'>
                            <Outflow
                                ref={outflow}
                                initialDate={initialDate}
                                finalDate={finalDate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}