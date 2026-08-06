'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateLoan from '@/api/loan/create'
import apiUpdateLoan from '@/api/loan/update'
import { DateTimePicker } from '@/components/inputs/dateTimePicker'
import { DecimalInput, IntegerInput } from '@/components/inputs/maskedInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Params {
    open: boolean
    bankAccounts: BankAccount[]
    loan?: Loan | null
    closed: (update?: boolean) => void
}

interface Form {
    bankAccountId: string
    description: string
    totalAmount: string
    installmentTotal: string
    dueDay: string
    interestRate: string
    startDate: Date
}

const emptyForm: Form = {
    bankAccountId: '',
    description: '',
    totalAmount: '',
    installmentTotal: '1',
    dueDay: '',
    interestRate: '',
    startDate: new Date(),
}

export function LoanFormDialog({ open, bankAccounts, loan, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const isEditing = !!loan

    const { control, handleSubmit, register, reset } = useForm<Form>({ defaultValues: emptyForm })

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        reset(
            loan
                ? {
                      bankAccountId: String(loan.bankAccountId),
                      description: loan.description,
                      totalAmount: String(loan.totalAmount),
                      installmentTotal: String(loan.installmentTotal),
                      dueDay: String(loan.dueDay),
                      interestRate: loan.interestRate === null ? '' : String(loan.interestRate),
                      startDate: new Date(loan.startDate),
                  }
                : { ...emptyForm, startDate: new Date() },
        )
    }, [open, loan, reset])

    const onSubmit = async ({ bankAccountId, description, totalAmount, installmentTotal, dueDay, interestRate, startDate }: Form) => {
        const normalizedDescription = description.trim()
        const dueDayNumber = parseInt(dueDay, 10)
        const interestRateNumber = interestRate.trim() ? parseFloat(interestRate) : null

        if (!normalizedDescription) {
            toast.error('Descrição é obrigatória.')
            return
        }

        if (isNaN(dueDayNumber) || dueDayNumber < 1 || dueDayNumber > 31) {
            toast.error('Informe um dia de vencimento entre 1 e 31.')
            return
        }

        if (interestRateNumber !== null && (isNaN(interestRateNumber) || interestRateNumber < 0)) {
            toast.error('Informe uma taxa de juros válida.')
            return
        }

        setLoading(true)

        if (isEditing) {
            const response = await apiUpdateLoan(loan!.id, {
                description: normalizedDescription,
                dueDay: dueDayNumber,
                interestRate: interestRateNumber,
            })

            if (!response.success) {
                toast.error(response.message || 'Erro ao salvar empréstimo. Tente novamente mais tarde.')
                setLoading(false)
                return
            }

            toast.success('Empréstimo atualizado com sucesso!')
            closed(true)
            return
        }

        const totalAmountNumber = parseFloat(totalAmount)
        const installmentTotalNumber = parseInt(installmentTotal, 10)

        if (!bankAccountId) {
            toast.error('Selecione uma conta bancária.')
            setLoading(false)
            return
        }

        if (isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
            toast.error('Informe um valor total maior que zero.')
            setLoading(false)
            return
        }

        if (isNaN(installmentTotalNumber) || installmentTotalNumber < 1) {
            toast.error('Informe um número de parcelas válido.')
            setLoading(false)
            return
        }

        const response = await apiCreateLoan({
            bankAccountId: Number(bankAccountId),
            description: normalizedDescription,
            totalAmount: totalAmountNumber,
            installmentTotal: installmentTotalNumber,
            dueDay: dueDayNumber,
            interestRate: interestRateNumber,
            startDate: startDate.toISOString(),
        })

        if (!response.success) {
            toast.error(response.message || 'Erro ao salvar empréstimo. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success('Empréstimo cadastrado com sucesso! As parcelas já foram lançadas como pendentes.')
        closed(true)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar empréstimo' : 'Novo empréstimo'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Valor, nº de parcelas e conta não podem ser alterados após a criação.'
                            : 'Ao cadastrar, as parcelas são lançadas automaticamente como pendentes.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    {!isEditing && (
                        <Field>
                            <FieldLabel htmlFor="loan-bank-account">Conta bancária</FieldLabel>
                            <Controller
                                name="bankAccountId"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Select value={value} onValueChange={onChange}>
                                        <SelectTrigger id="loan-bank-account" className="w-full">
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
                    )}

                    <Field>
                        <FieldLabel htmlFor="loan-description">Descrição</FieldLabel>
                        <Input id="loan-description" type="text" placeholder="Financiamento do carro" {...register('description')} />
                    </Field>

                    {!isEditing && (
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel htmlFor="loan-total-amount">Valor total</FieldLabel>
                                <Controller
                                    name="totalAmount"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <DecimalInput id="loan-total-amount" inputMode="decimal" placeholder="0.00" value={value} onChange={onChange} />
                                    )}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="loan-installment-total">Nº de parcelas</FieldLabel>
                                <Controller
                                    name="installmentTotal"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <IntegerInput id="loan-installment-total" placeholder="12" value={value} onChange={onChange} />
                                    )}
                                />
                            </Field>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldLabel htmlFor="loan-due-day">Dia de vencimento</FieldLabel>
                            <Controller
                                name="dueDay"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <IntegerInput id="loan-due-day" placeholder="10" value={value} onChange={onChange} />
                                )}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="loan-interest-rate">Taxa de juros mensal (%, opcional)</FieldLabel>
                            <Controller
                                name="interestRate"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <DecimalInput id="loan-interest-rate" inputMode="decimal" placeholder="0.00" value={value} onChange={onChange} />
                                )}
                            />
                        </Field>
                    </div>

                    {!isEditing && (
                        <Field>
                            <FieldLabel htmlFor="loan-start-date">Data da contratação</FieldLabel>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field: { value, onChange } }) => <DateTimePicker id="loan-start-date" value={value} onChange={onChange} />}
                            />
                        </Field>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                            {isEditing ? 'Salvar alterações' : 'Cadastrar empréstimo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
