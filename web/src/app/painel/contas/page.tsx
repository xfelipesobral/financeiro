'use client'

import { banksAccountsList } from '@/api/bankAccount/list'
import { BankAccount } from '@/components/bank/accounts/bankAccount'
import { Button } from '@/components/ui/button'

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BanksAccounts() {
    const router = useRouter()
    const [openPopupBankAccount, setOpenPopupBankAccount] = useState(false)
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)

    useEffect(() => {
        banksAccountsList().then(setAccounts)
    }, [])

    return (
        <div className="grid gap-4">
            <BankAccount
                open={openPopupBankAccount}
                close={() => {
                    setOpenPopupBankAccount(false)
                    setSelectedAccount(null)
                }}
            />
            <div className="flex gap-6 justify-between items-center">
                <div>
                    <p className="text-4xl font-bold tracking-tight text-stone-900">Contas</p>
                    <p className="text-stone-600 text-sm mt-1">Gerencie suas contas bancárias</p>
                </div>

                <Button
                    onClick={() => {
                        setSelectedAccount(null)
                        setOpenPopupBankAccount(true)
                    }}>
                    Nova conta
                </Button>
            </div>

            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-25">#</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Banco</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map((account) => (
                            <TableRow
                                key={account.guid}
                                className="cursor-pointer hover:bg-stone-50"
                                onClick={() => router.push(`/painel/contas/${account.id}`)}>
                                <TableCell className="font-medium">{account.id}</TableCell>
                                <TableCell>{account.description}</TableCell>
                                <TableCell>{account.bank.name}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedAccount(account)
                                            setOpenPopupBankAccount(true)
                                        }}>
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
