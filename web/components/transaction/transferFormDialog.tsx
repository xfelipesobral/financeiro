'use client'

import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateTransfer, { ApiCreateTransferParams } from '@/api/transfer/create'
import { DateTimePicker } from '@/components/inputs/dateTimePicker'
import { DecimalInput } from '@/components/inputs/maskedInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Params {
    open: boolean
    bankAccounts: BankAccount[]
    closed: (update?: boolean) => void
}

interface Form {
    fromBankAccountId: string
    toBankAccountId: string
    amount: string
    description: string
    date: Date
}

const emptyForm: Form = {
    fromBankAccountId: '',
    toBankAccountId: '',
    amount: '',
    description: '',
    date: new Date(),
}

export function TransferFormDialog({ open, bankAccounts, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const dialogContentRef = useRef<HTMLDivElement>(null)

    const { control, handleSubmit, register, reset } = useForm<Form>({ defaultValues: emptyForm })

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        reset({ ...emptyForm, date: new Date() })
    }, [open, reset])

    const onSubmit = async ({ fromBankAccountId, toBankAccountId, amount, description, date }: Form) => {
        const normalizedDescription = description.trim()
        const normalizedAmount = parseFloat(amount)

        if (!fromBankAccountId) {
            toast.error('Selecione a conta de origem.')
            return
        }

        if (!toBankAccountId) {
            toast.error('Selecione a conta de destino.')
            return
        }

        if (fromBankAccountId === toBankAccountId) {
            toast.error('A conta de origem e de destino não podem ser a mesma.')
            return
        }

        if (isNaN(normalizedAmount) || normalizedAmount <= 0) {
            toast.error('Informe um valor maior que zero.')
            return
        }

        if (!normalizedDescription) {
            toast.error('Descrição é obrigatória.')
            return
        }

        setLoading(true)

        const params: ApiCreateTransferParams = {
            fromBankAccountId: Number(fromBankAccountId),
            toBankAccountId: Number(toBankAccountId),
            amount: normalizedAmount,
            description: normalizedDescription,
            date: date.toISOString(),
        }

        const response = await apiCreateTransfer(params)

        if (!response.success) {
            toast.error(response.message || 'Erro ao salvar transferência. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success('Transferência realizada com sucesso!')
        closed(true)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent ref={dialogContentRef} className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nova transferência</DialogTitle>
                    <DialogDescription>Mova dinheiro entre duas das suas contas bancárias.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="transfer-from-bank-account">Conta de origem</FieldLabel>
                        <Controller
                            name="fromBankAccountId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="transfer-from-bank-account" className="w-full">
                                        <SelectValue placeholder="Selecione a conta de origem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankAccounts.map((bankAccount) => (
                                            <SelectItem key={bankAccount.id} value={String(bankAccount.id)}>
                                                {bankAccount.bank.name} · {bankAccount.description || bankAccount.accountNumber}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transfer-to-bank-account">Conta de destino</FieldLabel>
                        <Controller
                            name="toBankAccountId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="transfer-to-bank-account" className="w-full">
                                        <SelectValue placeholder="Selecione a conta de destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankAccounts.map((bankAccount) => (
                                            <SelectItem key={bankAccount.id} value={String(bankAccount.id)}>
                                                {bankAccount.bank.name} · {bankAccount.description || bankAccount.accountNumber}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transfer-date">Data e hora</FieldLabel>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DateTimePicker id="transfer-date" value={value} onChange={onChange} container={dialogContentRef} />
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transfer-amount">Valor</FieldLabel>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DecimalInput id="transfer-amount" inputMode="decimal" placeholder="0.00" value={value} onChange={onChange} />
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transfer-description">Descrição</FieldLabel>
                        <Input id="transfer-description" type="text" placeholder="Transferência para reserva" {...register('description')} />
                    </Field>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <ArrowLeftRight />}
                            Transferir
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
