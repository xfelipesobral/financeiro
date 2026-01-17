'use client'

import { getBankAccount } from '@/api/bankAccount/get'
import { Button } from '@/components/ui/button'
//import { formatDate } from '@/lib/formatDate'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BankAccountDetail() {
    const params = useParams()
    const router = useRouter()
    const [account, setAccount] = useState<BankAccount | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadAccount = async () => {
            const id = params.id as string
            const data = await getBankAccount(id)
            setAccount(data)
            setLoading(false)
        }

        loadAccount()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-stone-600">Carregando...</p>
            </div>
        )
    }

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <p className="text-stone-600">Conta não encontrada</p>
                <Button onClick={() => router.back()}>Voltar</Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6">
            <div className="flex gap-6 justify-between items-center">
                <div>
                    <p className="text-4xl font-bold tracking-tight text-stone-900">{account.description}</p>
                    {/* <p className="text-stone-600 text-sm mt-1">{account.bank.name}</p> */}
                </div>

                <Button variant="outline" onClick={() => router.back()}>
                    Voltar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-stone-200 p-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Informações da Conta</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-stone-600 uppercase">Descrição</p>
                            <p className="text-sm text-stone-900 mt-1">{account.description}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-stone-600 uppercase">Banco</p>
                            {/* <p className="text-sm text-stone-900 mt-1">{account.bank.name}</p> */}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-stone-600 uppercase">Número da Conta</p>
                            <p className="text-sm text-stone-900 mt-1">{account.accountNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-stone-600 uppercase">Código da Agência</p>
                            <p className="text-sm text-stone-900 mt-1">{account.branchCode}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-stone-200 p-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Chaves PIX</h3>
                    {account.pixKeys.length > 0 ? (
                        <div className="space-y-2">
                            {account.pixKeys.map((key, index) => (
                                <div key={index} className="text-sm text-stone-900 break-all bg-stone-50 p-2 rounded">
                                    {key}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-stone-600">Nenhuma chave PIX cadastrada</p>
                    )}
                </div>

                <div className="bg-white rounded-lg border border-stone-200 p-6">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Datas</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-stone-600 uppercase">Criada em</p>
                            {/* <p className="text-sm text-stone-900 mt-1">{formatDate(new Date(account.createdAt))}</p> */}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-stone-600 uppercase">Atualizada em</p>
                            {/* <p className="text-sm text-stone-900 mt-1">{formatDate(new Date(account.updatedAt))}</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
