'use client'

import { ApiSteamInventoryItemDetails } from '@/api/steam/itens/getItem'
import { SubTitle, Title } from '@/components/title'
import Image from 'next/image'
import { ItemDetailsContext } from './context'
import { SteamItemDetailsTransactions } from './transactions'
import { numberToBrl } from '@/lib/formatNumber'

export function SteamItemDetails({ data, backgroundItemImage }: Params) {
    return (
        <ItemDetailsContext.Provider value={data}>
            <div className="grid gap-4">
                <div>
                    <div className="flex-1">
                        <Title>{data.name}</Title>
                        <SubTitle>{data.description || 'Sem descrição'}</SubTitle>
                    </div>
                </div>

                <div className="border rounded-lg relative flex items-center justify-center bg-radial from-stone-50 to-stone-300">
                    <div>
                        <img src={data.imageUrl} alt={data.name} className="w-56 h-56 object-contain relative z-10" />
                    </div>
                    <Image
                        src={`/${backgroundItemImage}`}
                        alt="Imagem do item"
                        width={1000}
                        height={563}
                        className="absolute w-full h-full top-0 left-0 object-cover rounded-lg opacity-20"
                    />
                </div>

                <div className="rounded-xl border overflow-hidden grid divide-y sm:grid-cols-2 lg:grid-cols-5 lg:divide-y-0 sm:divide-x">
                    <div className="px-4 py-3 bg-linear-90 from-stone-100 to-white">
                        <p className="text-sm text-stone-500">Valor total</p>
                        <p className="text-base font-bold">{numberToBrl(data.lastPrice * data.quantity)}</p>
                    </div>

                    <div className="px-4 py-3">
                        <p className="text-sm text-stone-500">Preço atual</p>
                        <p className="text-base font-bold">{numberToBrl(data.lastPrice)}</p>
                    </div>

                    <div className="px-4 py-3">
                        <p className="text-sm text-stone-500">Quantidade</p>
                        <p className="text-base font-bold">{data.quantity}</p>
                    </div>

                    <div className="px-4 py-3">
                        <p className="text-sm text-stone-500">Último pago</p>
                        <p className="text-base font-bold">
                            {data.lastPaidPrice ? (
                                `${numberToBrl(data.lastPaidPrice)}`
                            ) : (
                                <span className="text-base text-stone-500 font-normal">N/A</span>
                            )}
                        </p>
                    </div>

                    <div className="px-4 py-3">
                        <p className="text-sm text-stone-500">Último vendido</p>
                        <p className="text-base font-bold">{data.lastSoldPrice ? `${numberToBrl(data.lastSoldPrice)}` : 'Item nunca vendido'}</p>
                    </div>
                </div>

                <SteamItemDetailsTransactions />
            </div>
        </ItemDetailsContext.Provider>
    )
}

interface Params {
    data: ApiSteamInventoryItemDetails
    backgroundItemImage: string
}
