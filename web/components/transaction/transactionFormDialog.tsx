'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateTransaction from '@/api/transaction/create'
import apiUpdateTransaction from '@/api/transaction/update'
import { DateTimePicker } from '@/components/inputs/dateTimePicker'
import { DecimalInput } from '@/components/inputs/maskedInput'
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ComboboxOption {
    value: string
    label: string
}

interface Params {
    open: boolean
    bankAccounts: BankAccount[]
    categories: Category[]
    transaction?: Transaction | null
    closed: (update?: boolean) => void
}

interface Form {
    bankAccountId: string
    categoryId: string
    totalAmount: string
    description: string
    date: Date
}

const emptyForm: Form = {
    bankAccountId: '',
    categoryId: '',
    totalAmount: '',
    description: '',
    date: new Date(),
}

export function TransactionFormDialog({ open, bankAccounts, categories, transaction, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const dialogContentRef = useRef<HTMLDivElement>(null)
    const isEditing = !!transaction

    const { control, handleSubmit, register, reset } = useForm<Form>({ defaultValues: emptyForm })

    const categoryOptions: ComboboxOption[] = useMemo(
        () => categories.map((category) => ({ value: String(category.id), label: `${category.description} · ${category.type === 'CREDIT' ? 'Crédito' : 'Débito'}` })),
        [categories],
    )

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        reset(
            transaction
                ? {
                      bankAccountId: String(transaction.bankAccountId),
                      categoryId: String(transaction.categoryId),
                      totalAmount: String(transaction.totalAmount),
                      description: transaction.description,
                      date: new Date(transaction.date),
                  }
                : { ...emptyForm, date: new Date() },
        )
    }, [open, transaction, reset])

    const onSubmit = async ({ bankAccountId, categoryId, totalAmount, description, date }: Form) => {
        const normalizedDescription = description.trim()
        const amount = parseFloat(totalAmount)

        if (!bankAccountId) {
            toast.error('Selecione uma conta bancária.')
            return
        }

        if (!categoryId) {
            toast.error('Selecione uma categoria.')
            return
        }

        if (isNaN(amount) || amount <= 0) {
            toast.error('Informe um valor maior que zero.')
            return
        }

        if (!normalizedDescription) {
            toast.error('Descrição é obrigatória.')
            return
        }

        setLoading(true)

        const params = {
            bankAccountId: Number(bankAccountId),
            categoryId: Number(categoryId),
            totalAmount: amount,
            description: normalizedDescription,
            date: date.toISOString(),
        }

        const response = isEditing ? await apiUpdateTransaction(transaction!.id, params) : await apiCreateTransaction(params)

        if (!response.success) {
            toast.error(response.message || 'Erro ao salvar lançamento. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success(isEditing ? 'Lançamento atualizado com sucesso!' : 'Lançamento adicionado com sucesso!')
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
                    <DialogTitle>{isEditing ? 'Editar lançamento' : 'Novo lançamento'}</DialogTitle>
                    <DialogDescription>Registre uma entrada (crédito) ou saída (débito) financeira.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="transaction-bank-account">Conta bancária</FieldLabel>
                        <Controller
                            name="bankAccountId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="transaction-bank-account" className="w-full">
                                        <SelectValue placeholder="Selecione uma conta" />
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
                        <FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Combobox
                                    items={categoryOptions}
                                    value={categoryOptions.find((option) => option.value === value) ?? null}
                                    onValueChange={(option) => onChange(option ? option.value : '')}>
                                    <ComboboxInput id="transaction-category" className="w-full" placeholder="Selecione uma categoria" />
                                    <ComboboxContent container={dialogContentRef}>
                                        <ComboboxEmpty>Nenhuma categoria encontrada.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(option: ComboboxOption) => (
                                                <ComboboxItem key={option.value} value={option}>
                                                    {option.label}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transaction-date">Data e hora</FieldLabel>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DateTimePicker id="transaction-date" value={value} onChange={onChange} container={dialogContentRef} />
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transaction-amount">Valor</FieldLabel>
                        <Controller
                            name="totalAmount"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DecimalInput id="transaction-amount" inputMode="decimal" placeholder="0.00" value={value} onChange={onChange} />
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="transaction-description">Descrição</FieldLabel>
                        <Input id="transaction-description" type="text" placeholder="Supermercado do mês" {...register('description')} />
                    </Field>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                            {isEditing ? 'Salvar alterações' : 'Adicionar lançamento'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
