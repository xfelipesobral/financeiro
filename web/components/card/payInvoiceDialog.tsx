'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import apiPayCardInvoice from '@/api/card/payInvoice'
import { DatePicker } from '@/components/inputs/datePicker'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { numberToBrl } from '@/lib/formatNumber'

export interface CardInvoice {
    card: Card
    dueDate: string
    totalAmount: number
    payments: PendingPayment[]
}

interface Params {
    invoice: CardInvoice | null
    bankAccounts: BankAccount[]
    closed: (update?: boolean) => void
}

export function PayInvoiceDialog({ invoice, bankAccounts, closed }: Params) {
    const open = !!invoice
    const dialogContentRef = useRef<HTMLDivElement>(null)

    const [loading, setLoading] = useState(false)
    const [bankAccountId, setBankAccountId] = useState('')
    const [paidAt, setPaidAt] = useState<Date>(new Date())

    useEffect(() => {
        setLoading(false)
        setBankAccountId(invoice ? String(invoice.card.bankAccountId) : '')
        setPaidAt(new Date())
    }, [invoice])

    const onSubmit = async () => {
        if (!invoice) return

        if (!bankAccountId) {
            toast.error('Selecione a conta de onde saiu o pagamento.')
            return
        }

        setLoading(true)

        const response = await apiPayCardInvoice(invoice.card.id, {
            bankAccountId: Number(bankAccountId),
            dueDate: invoice.dueDate,
            paidAt: paidAt.toISOString(),
        })

        if (response.success) {
            toast.success('Fatura paga com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao pagar fatura. Tente novamente mais tarde.')
        }

        setLoading(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent ref={dialogContentRef} className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Pagar fatura {invoice?.card.name}</DialogTitle>
                    <DialogDescription>Debita o valor total da fatura de uma conta e marca as parcelas como pagas.</DialogDescription>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[40vh] overflow-y-auto px-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Compra</TableHead>
                                <TableHead>Parcela</TableHead>
                                <TableHead>Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice?.payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.transaction.description}</TableCell>
                                    <TableCell>{payment.installmentNumber ?? '-'}</TableCell>
                                    <TableCell>{numberToBrl(payment.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <p className="text-sm font-medium">Total da fatura: {numberToBrl(invoice?.totalAmount ?? 0)}</p>

                <Field>
                    <FieldLabel htmlFor="pay-invoice-bank-account">Conta de débito</FieldLabel>
                    <Select value={bankAccountId} onValueChange={setBankAccountId}>
                        <SelectTrigger id="pay-invoice-bank-account" className="w-full">
                            <SelectValue placeholder="Selecione a conta de onde saiu o pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                            {bankAccounts.map((account) => (
                                <SelectItem key={account.id} value={String(account.id)}>
                                    {account.bank.name} · {account.description || account.accountNumber}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field>
                    <FieldLabel htmlFor="pay-invoice-paid-at">Data do pagamento</FieldLabel>
                    <DatePicker id="pay-invoice-paid-at" value={paidAt} onChange={setPaidAt} container={dialogContentRef} />
                </Field>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={onSubmit} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <CircleCheck />}
                        Pagar fatura
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
