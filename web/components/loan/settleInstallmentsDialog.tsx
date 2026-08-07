'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import apiSettleLoanInstallments from '@/api/loan/settleInstallments'
import { DatePicker } from '@/components/inputs/datePicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Params {
    loan?: Loan | null
    bankAccounts: BankAccount[]
    closed: (update?: boolean) => void
}

export function SettleInstallmentsDialog({ loan, bankAccounts, closed }: Params) {
    const open = !!loan
    const dialogContentRef = useRef<HTMLDivElement>(null)

    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<Record<number, boolean>>({})
    const [paidAtByPayment, setPaidAtByPayment] = useState<Record<number, Date>>({})
    const [bankAccountId, setBankAccountId] = useState('')

    const pendingPayments = [...(loan?.payments ?? [])]
        .filter((payment) => payment.status === 'PENDING')
        .sort((a, b) => (a.installmentNumber ?? 0) - (b.installmentNumber ?? 0))

    useEffect(() => {
        setLoading(false)
        setSelected({})
        setPaidAtByPayment(Object.fromEntries(pendingPayments.map((payment) => [payment.id, new Date(payment.dueDate)])))
        setBankAccountId(loan ? String(loan.bankAccountId) : '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loan])

    const hasSelected = Object.values(selected).some(Boolean)

    const onSubmit = async () => {
        const installments = Object.entries(selected)
            .filter(([, checked]) => checked)
            .map(([paymentId]) => ({
                paymentId: Number(paymentId),
                paidAt: paidAtByPayment[Number(paymentId)].toISOString(),
            }))

        if (!installments.length) {
            toast.error('Selecione ao menos uma parcela.')
            return
        }

        if (!bankAccountId) {
            toast.error('Selecione a conta bancária de onde saiu o pagamento.')
            return
        }

        setLoading(true)

        const response = await apiSettleLoanInstallments(loan!.id, { bankAccountId: Number(bankAccountId), installments })

        if (response.success) {
            toast.success(`${installments.length} parcela(s) baixada(s) com sucesso!`)
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao dar baixa nas parcelas. Tente novamente mais tarde.')
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
                    <DialogTitle>Dar baixa em parcelas</DialogTitle>
                    <DialogDescription>Selecione as parcelas já pagas e, se precisar, ajuste a data de baixa de cada uma.</DialogDescription>
                </DialogHeader>

                <Field>
                    <FieldLabel htmlFor="settle-installments-bank-account">Conta de débito</FieldLabel>
                    <Select value={bankAccountId} onValueChange={setBankAccountId}>
                        <SelectTrigger id="settle-installments-bank-account" className="w-full">
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

                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    {pendingPayments.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-0" />
                                    <TableHead>Parcela</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Data de baixa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={!!selected[payment.id]}
                                                onCheckedChange={(checked) => setSelected((current) => ({ ...current, [payment.id]: !!checked }))}
                                            />
                                        </TableCell>
                                        <TableCell>{payment.installmentNumber}</TableCell>
                                        <TableCell>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell>{payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                        <TableCell>
                                            <DatePicker
                                                value={paidAtByPayment[payment.id] ?? new Date(payment.dueDate)}
                                                onChange={(date) => setPaidAtByPayment((current) => ({ ...current, [payment.id]: date }))}
                                                container={dialogContentRef}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">Todas as parcelas já foram pagas.</p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    {!!pendingPayments.length && (
                        <Button onClick={onSubmit} disabled={loading || !hasSelected}>
                            {loading ? <Loader2 className="animate-spin" /> : <CircleCheck />}
                            Dar baixa nas parcelas selecionadas
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
