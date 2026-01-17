'use client'

import Inflow, { InflowRef } from '@/components/tabelas/inflow'
import Outflow, { OutflowRef } from '@/components/tabelas/outflow'
import { Transaction } from '@/components/painel/transaction'
import { useEffect, useRef, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { currentMonthPeriod, currentWeekPeriod, currentYearPeriod } from '@/lib/formatDate'
import { totalTransactions } from '@/api/transaction/total'
import { numberToReal } from '@/lib/formatNumber'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

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
        debit: 0,
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
                finalDate: finalDate?.toJSON(),
            }).then(setTransactionsTotals)
        }, 100)
    }

    return (
        <div className="flex-1 flex flex-col gap-6">
            <div className="flex gap-6 justify-between items-center">
                <div>
                    <p className="text-4xl font-bold tracking-tight text-stone-900">{title}</p>
                    <p className="text-stone-600 text-sm mt-1">
                        Resumo da sua saúde financeira{' '}
                        {
                            {
                                week: 'nesta semana',
                                month: 'neste mês',
                                year: 'neste ano',
                            }[period]
                        }
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    <Tabs value={period} onValueChange={(i) => setPeriod(i as Period)}>
                        <TabsList className="bg-muted">
                            <TabsTrigger value="week">Semanal</TabsTrigger>
                            <TabsTrigger value="month">Mensal</TabsTrigger>
                            <TabsTrigger value="year">Anual</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Transaction reloadTransactions={reloadData} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-linear-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-xl p-6 transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-stone-600 text-sm font-medium">Saldo Total</p>
                        <div className="bg-stone-200/50 p-2.5 rounded-lg">
                            <Wallet className="w-4 h-4 text-stone-700" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-stone-900 slashed-zero mb-2">{numberToReal(transactionsTotals.balance)}</p>
                    <p className={`text-xs font-medium ${transactionsTotals.balance >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {transactionsTotals.balance >= 0 ? '↑ Saldo positivo' : '↓ Saldo negativo'}
                    </p>
                </div>

                <div className="bg-linear-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 rounded-xl p-6 ">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-emerald-700 text-sm font-medium">Entradas</p>
                        <div className="bg-emerald-200/50 p-2.5 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-emerald-700" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-stone-900 slashed-zero mb-2">{numberToReal(transactionsTotals.credit)}</p>
                    <p className="text-xs font-medium text-emerald-700">
                        {period === 'week' ? 'Esta semana' : period === 'month' ? 'Este mês' : 'Este ano'}
                    </p>
                </div>

                <div className="bg-linear-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-xl p-6 ">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-amber-700 text-sm font-medium">Saídas</p>
                        <div className="bg-amber-200/50 p-2.5 rounded-lg">
                            <TrendingDown className="w-4 h-4 text-amber-700" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-stone-900 slashed-zero mb-2">{numberToReal(transactionsTotals.debit)}</p>
                    <p className="text-xs font-medium text-amber-700">
                        {period === 'week' ? 'Esta semana' : period === 'month' ? 'Este mês' : 'Este ano'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-stone-200">
                        <div>
                            <p className="font-bold text-xl text-stone-900">Entradas</p>
                            <p className="text-sm text-stone-600 mt-1">
                                {
                                    {
                                        week: 'Últimas entradas na semana',
                                        month: 'Últimas entradas no mês',
                                        year: 'Últimas entradas no ano',
                                    }[period]
                                }
                            </p>
                        </div>
                    </div>
                    <div className="p-6">
                        <Inflow ref={inflow} initialDate={initialDate} finalDate={finalDate} />
                    </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-stone-200">
                        <div>
                            <p className="font-bold text-xl text-stone-900">Saídas</p>
                            <p className="text-sm text-stone-600 mt-1">
                                {
                                    {
                                        week: 'Últimas saídas na semana',
                                        month: 'Últimas saídas no mês',
                                        year: 'Últimas saídas no ano',
                                    }[period]
                                }
                            </p>
                        </div>
                    </div>
                    <div className="p-6">
                        <Outflow ref={outflow} initialDate={initialDate} finalDate={finalDate} />
                    </div>
                </div>
            </div>
        </div>
    )
}
