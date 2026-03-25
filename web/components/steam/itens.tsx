'use client'

import apiGetSteamItens, { ApiSteamInventoryItem } from '@/api/steam/itens/getItens'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {itens.map((item) => {
                    const profit = calcProfit(item.lastPrice, item.averagePaidPrice ?? 0)

                    return (
                        <div
                            key={item.id}
                            className="border rounded-lg flex flex-col hover:shadow-lg hover:border-stone-300 transition-all"
                            onClick={() => {
                                location.href = `/painel/inventario-steam/${item.id}`
                            }}>
                            <div
                                className="relative rounded-t-lg flex items-center justify-center p-2 bg-linear-120 from-stone-50 to-stone-100 border-b-4"
                                style={{
                                    borderColor: item.color,
                                }}>
                                {item.quantity > 1 && (
                                    <div className="bg-white border rounded-sm text-xs font-mono absolute top-2 right-2 px-2 py1">
                                        ×{item.quantity}
                                    </div>
                                )}

                                <img src={item.imageUrl} alt={item.name} className="w-32 object-contain rounded" />
                            </div>
                            <div className="p-2 flex flex-col items-start justify-between gap-2 flex-1">
                                <div>
                                    <p className="font-medium text-sm mb-1 line-clamp-2">{item.name}</p>

                                    <p className="text-xs text-stone-500 line-clamp-2" title={item.description}>
                                        {item.description}
                                    </p>
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
                                    <ProfitRender percentage={profit.percentage} flag={profit.flag} />
                                </div>
                                {/*<p>Último preço pago: {item.lastPaidPrice ? `$${item.lastPaidPrice}` : 'N/A'}</p>
                        <p>Último preço vendido: {item.lastSoldPrice ? `$${item.lastSoldPrice}` : 'N/A'}</p> */}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function ProfitRender({ percentage, flag }: { percentage: number; flag: ProfitFlag }) {
    if (percentage <= 1) return null

    if (flag === 'encreased') {
        return <p className="text-xs text-green-700">+{percentage.toFixed(2)}%</p>
    } else if (flag === 'decreased') {
        return <p className="text-xs text-red-600">-{percentage.toFixed(2)}%</p>
    }

    return null
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
