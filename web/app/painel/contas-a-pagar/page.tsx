'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import apiGetBankAccounts from '@/api/bankAccount/list'
import apiGetCards from '@/api/card/list'
import apiGetLoans from '@/api/loan/list'
import apiGetPendingPayments from '@/api/payment/pending'
import { CardInvoice, PayInvoiceDialog } from '@/components/card/payInvoiceDialog'
import { groupPendingPayments, isOverdue } from '@/components/payables/groupPendingPayments'
import { SubTitle, Title } from '@/components/title'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card as UiCard, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { numberToBrl } from '@/lib/formatNumber'

export default function ContasAPagarPage() {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const [cards, setCards] = useState<Card[]>([])
    const [loans, setLoans] = useState<Loan[]>([])
    const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
    const [loading, setLoading] = useState(true)
    const [payingInvoice, setPayingInvoice] = useState<CardInvoice | null>(null)

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        setLoading(true)

        const [bankAccountsResponse, cardsResponse, loansResponse, pendingPaymentsResponse] = await Promise.all([
            apiGetBankAccounts(),
            apiGetCards(),
            apiGetLoans(),
            apiGetPendingPayments(),
        ])

        if (!bankAccountsResponse.success) toast.error(bankAccountsResponse.message || 'Erro ao buscar contas bancárias')
        else setBankAccounts(bankAccountsResponse.data || [])

        if (!cardsResponse.success) toast.error(cardsResponse.message || 'Erro ao buscar cartões')
        else setCards(cardsResponse.data || [])

        if (!loansResponse.success) toast.error(loansResponse.message || 'Erro ao buscar empréstimos')
        else setLoans(loansResponse.data || [])

        if (!pendingPaymentsResponse.success) toast.error(pendingPaymentsResponse.message || 'Erro ao buscar pendências')
        else setPendingPayments(pendingPaymentsResponse.data || [])

        setLoading(false)
    }

    const months = groupPendingPayments(pendingPayments)

    return (
        <div className="p-4 grid gap-6">
            <PayInvoiceDialog
                invoice={payingInvoice}
                bankAccounts={bankAccounts}
                closed={(reload = false) => {
                    setPayingInvoice(null)

                    if (reload) {
                        fetchAll()
                    }
                }}
            />

            <div>
                <Title>Contas a pagar</Title>
                <SubTitle>Saldo das suas contas e quanto falta pagar nos próximos meses</SubTitle>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bankAccounts.map((bankAccount) => (
                    <UiCard key={bankAccount.id}>
                        <CardHeader>
                            <CardTitle>
                                {bankAccount.bank.name} · {bankAccount.description || bankAccount.accountNumber}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-semibold ${bankAccount.balance < 0 ? 'text-destructive' : ''}`}>
                                {numberToBrl(bankAccount.balance)}
                            </p>
                        </CardContent>
                    </UiCard>
                ))}
            </div>

            {!loading && !months.length && <p className="text-sm text-muted-foreground">Nenhuma pendência encontrada. Tudo em dia!</p>}

            <div className="grid gap-4">
                {months.map((month) => (
                    <UiCard key={month.monthKey}>
                        <CardHeader>
                            <CardTitle>{month.monthLabel}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Vencimento</TableHead>
                                        <TableHead>Situação</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {month.cardGroups.map((group) => {
                                        const card = cards.find((currentCard) => currentCard.id === group.cardId)

                                        return (
                                            <TableRow key={group.key}>
                                                <TableCell>
                                                    <Badge variant="secondary">Cartão</Badge>
                                                </TableCell>
                                                <TableCell>{card?.name || 'Cartão'}</TableCell>
                                                <TableCell>{new Date(group.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                                                <TableCell>
                                                    {isOverdue(group.dueDate) && <Badge variant="destructive">Atrasado</Badge>}
                                                </TableCell>
                                                <TableCell>{numberToBrl(group.totalAmount)}</TableCell>
                                                <TableCell className="text-right">
                                                    {card && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                setPayingInvoice({
                                                                    card,
                                                                    dueDate: group.dueDate,
                                                                    totalAmount: group.totalAmount,
                                                                    payments: group.payments,
                                                                })
                                                            }>
                                                            Pagar fatura
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}

                                    {month.loanGroups.map((group) => {
                                        const loan = loans.find((currentLoan) => currentLoan.id === group.loanId)

                                        return (
                                            <TableRow key={group.key}>
                                                <TableCell>
                                                    <Badge variant="secondary">Empréstimo</Badge>
                                                </TableCell>
                                                <TableCell>{loan?.description || 'Empréstimo'}</TableCell>
                                                <TableCell>{new Date(group.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                                                <TableCell>
                                                    {isOverdue(group.dueDate) && <Badge variant="destructive">Atrasado</Badge>}
                                                </TableCell>
                                                <TableCell>{numberToBrl(group.totalAmount)}</TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    Dar baixa em Empréstimos
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </UiCard>
                ))}
            </div>
        </div>
    )
}
