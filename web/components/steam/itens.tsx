'use client'

import apiGetSteamItens, { ApiSteamInventoryItem } from '@/api/steam/itens/getItens'
import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function SteamItens() {
    const [itens, setItens] = useState<ApiSteamInventoryItem[]>([])
    const [estimatedTotalValue, setEstimatedTotalValue] = useState(0)

    useEffect(() => {
        fetchItens()
    }, [])

    const fetchItens = async () => {
        const itens = await apiGetSteamItens()

        if (!itens.success) {
            toast.error(itens.message || 'Erro ao buscar itens do Steam')
            return
        }

        if (!itens.data) itens.data = []

        itens.data.sort((a, b) => b.lastPrice - a.lastPrice)

        const estimatedTotalValue = itens.data.reduce((total, item) => total + item.lastPrice * item.quantity, 0)

        setEstimatedTotalValue(estimatedTotalValue)
        setItens(itens.data)
    }

    return (
        <div>
            <div className="rounded-lg p-2 bg-linear-to-r from-stone-50 to-white mb-4">
                <p className="text-xs text-stone-400 font-medium">Valor Estimado Total</p>
                <p className="font-bold text-stone-800 ">{estimatedTotalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                {itens.map((item) => {
                    const profit = calcProfit(item.lastPrice, item.averagePaidPrice ?? 0)

                    return (
                        <Link
                            key={item.id}
                            className="border rounded-lg flex flex-col hover:shadow-md hover:border-stone-300 transition-all relative"
                            href={`/painel/inventario-steam/${item.id}`}
                            prefetch={false}
                            title={item.name}>
                            <ProfitRender percentage={profit.percentage} flag={profit.flag} />

                            {item.quantity > 1 && (
                                <div className="bg-white/60 backdrop-blur-sm rounded-lg text-xs absolute top-1 left-1 p-1">
                                    <p>×{item.quantity}</p>
                                </div>
                            )}

                            <div
                                className={cn('bg-radial from-white to-stone-100 items-center justify-center p-2 rounded-t-lg flex border-b-2')}
                                style={{
                                    borderColor: item.color,
                                }}>
                                <img src={item.imageUrl} alt={item.name} className="w-32 object-contain rounded" />
                            </div>
                            <div className="p-2 flex flex-col items-start justify-between  flex-1">
                                <div>
                                    <p className="text-sm mb-1 line-clamp-1">{item.name}</p>
                                </div>

                                <div className="flex items-center gap-1">
                                    <p className="font-medium text-sm">
                                        {(item.lastPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-stone-400">
                                            ({item.lastPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
                                        </p>
                                    )}
                                </div>
                                {/*<p>Último preço pago: {item.lastPaidPrice ? `$${item.lastPaidPrice}` : 'N/A'}</p>
                        <p>Último preço vendido: {item.lastSoldPrice ? `$${item.lastSoldPrice}` : 'N/A'}</p> */}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

function ProfitRender({ percentage, flag }: { percentage: number; flag: ProfitFlag }) {
    if (percentage <= 1) return null

    if (flag !== 'encreased' && flag !== 'decreased') return null

    const [textColor, bgColor, Icon] = {
        encreased: ['text-green-700', 'bg-green-100/40', ArrowUpIcon],
        decreased: ['text-red-600', 'bg-red-100/40', ArrowDownIcon],
    }[flag]

    return (
        <div
            className={cn(
                'absolute top-1 right-1 z-10 p-1 text-xs rounded-lg backdrop-blur-sm flex items-center justify-center',
                bgColor,
                textColor,
            )}>
            <Icon size={12} />
            <p>{percentage.toFixed(2)}%</p>
        </div>
    )
}

function calcProfit(lastPrice: number, averagePaidPrice: number = 0) {
    let flag: ProfitFlag = 'equal'
    let percentage = 0

    if (lastPrice > averagePaidPrice) {
        flag = 'encreased'
        percentage = ((lastPrice - averagePaidPrice) / averagePaidPrice) * 100
    } else if (lastPrice < averagePaidPrice) {
        flag = 'decreased'
        percentage = ((averagePaidPrice - lastPrice) / averagePaidPrice) * 100
    }

    return { flag, percentage }
}

type ProfitFlag = 'encreased' | 'decreased' | 'equal'
