'use client'

import { useEffect, useRef, useState } from 'react'
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
    desiredMonthlyPayment: string
    startDate: Date
}

const emptyForm: Form = {
    bankAccountId: '',
    description: '',
    totalAmount: '',
    installmentTotal: '1',
    dueDay: '',
    interestRate: '',
    desiredMonthlyPayment: '',
    startDate: new Date(),
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// Sistema de amortização francês (Tabela Price): parcelas fixas, juros compostos mês a mês.
function calculateInstallmentEstimate(principal: number, monthlyRatePercent: number, installmentCount: number) {
    if (!(principal > 0) || !(installmentCount >= 1) || !Number.isFinite(installmentCount)) return null

    const monthlyRate = monthlyRatePercent / 100

    const installmentAmount =
        monthlyRate > 0 ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -installmentCount)) : principal / installmentCount

    if (!Number.isFinite(installmentAmount)) return null

    const totalAmount = installmentAmount * installmentCount

    return {
        installmentAmount,
        totalAmount,
        totalInterest: totalAmount - principal,
    }
}

// Simula quitar a dívida pagando um valor fixo por mês: os juros do saldo devedor
// são cobrados a cada mês e a diferença abate o principal. A última parcela fecha
// só com o que resta (por isso costuma ser menor que as demais).
function calculateFixedPaymentPlan(principal: number, monthlyRatePercent: number, monthlyPayment: number) {
    if (!(principal > 0) || !(monthlyPayment > 0)) return null

    const monthlyRate = monthlyRatePercent / 100
    const maxMonths = 1200 // 100 anos, limite de segurança

    if (monthlyPayment <= principal * monthlyRate) return { insufficient: true as const }

    let balance = principal
    let months = 0
    let totalPaid = 0
    let lastInstallment = 0

    while (balance > 0.005 && months < maxMonths) {
        months++
        balance += balance * monthlyRate
        lastInstallment = Math.min(monthlyPayment, balance)
        balance -= lastInstallment
        totalPaid += lastInstallment
    }

    if (balance > 0.005) return null

    return {
        insufficient: false as const,
        months,
        lastInstallment,
        totalPaid,
        totalInterest: totalPaid - principal,
    }
}

export function LoanFormDialog({ open, bankAccounts, loan, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const isEditing = !!loan
    const dialogContentRef = useRef<HTMLDivElement>(null)

    const { control, handleSubmit, register, reset, watch, setValue } = useForm<Form>({ defaultValues: emptyForm })

    const [watchedTotalAmount, watchedInstallmentTotal, watchedInterestRate, watchedDesiredMonthlyPayment] = watch([
        'totalAmount',
        'installmentTotal',
        'interestRate',
        'desiredMonthlyPayment',
    ])

    const principal = Number(watchedTotalAmount)
    const monthlyRate = watchedInterestRate.trim() ? Number(watchedInterestRate) : 0

    const fixedPaymentPlan = watchedDesiredMonthlyPayment.trim()
        ? calculateFixedPaymentPlan(principal, monthlyRate, Number(watchedDesiredMonthlyPayment))
        : null

    const installmentEstimate = fixedPaymentPlan ? null : calculateInstallmentEstimate(principal, monthlyRate, parseInt(watchedInstallmentTotal, 10))

    // Quando há um pagamento mensal desejado, quem manda no nº de parcelas é o servidor (que aplica
    // os juros compostos de verdade); aqui só refletimos a simulação no campo, que fica desabilitado.
    // Depende só do nº de meses (primitivo) para não entrar em loop: `fixedPaymentPlan` é um objeto
    // novo a cada render, então usá-lo direto como dependência disparava o efeito indefinidamente.
    const fixedPaymentPlanMonths = fixedPaymentPlan && !fixedPaymentPlan.insufficient ? fixedPaymentPlan.months : null

    useEffect(() => {
        if (fixedPaymentPlanMonths !== null) {
            setValue('installmentTotal', String(fixedPaymentPlanMonths))
        }
    }, [fixedPaymentPlanMonths, setValue])

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
                      desiredMonthlyPayment: '',
                      startDate: new Date(loan.startDate),
                  }
                : { ...emptyForm, startDate: new Date() },
        )
    }, [open, loan, reset])

    const onSubmit = async ({
        bankAccountId,
        description,
        totalAmount,
        installmentTotal,
        dueDay,
        interestRate,
        desiredMonthlyPayment,
        startDate,
    }: Form) => {
        setLoading(true)

        try {
            const normalizedDescription = description.trim()
            const dueDayNumber = parseInt(dueDay, 10)
            const interestRateNumber = interestRate.trim() ? Number(interestRate) : null
            const desiredMonthlyPaymentNumber = desiredMonthlyPayment.trim() ? Number(desiredMonthlyPayment) : null

            if (!normalizedDescription) {
                throw new Error('Descrição é obrigatória.')
            }

            if (isNaN(dueDayNumber) || dueDayNumber < 1 || dueDayNumber > 31) {
                throw new Error('Informe um dia de vencimento entre 1 e 31.')
            }

            if (interestRateNumber !== null && (isNaN(interestRateNumber) || interestRateNumber < 0)) {
                throw new Error('Informe uma taxa de juros válida.')
            }

            if (desiredMonthlyPaymentNumber !== null && (isNaN(desiredMonthlyPaymentNumber) || desiredMonthlyPaymentNumber <= 0)) {
                throw new Error('Informe um pagamento mensal válido.')
            }

            if (isEditing) {
                const response = await apiUpdateLoan(loan!.id, {
                    description: normalizedDescription,
                    dueDay: dueDayNumber,
                    interestRate: interestRateNumber,
                })

                if (!response.success) {
                    throw new Error(response.message || 'Erro ao salvar empréstimo. Tente novamente mais tarde.')
                }

                toast.success('Empréstimo atualizado com sucesso!')
                closed(true)
                return
            }

            const totalAmountNumber = Number(totalAmount)

            if (!bankAccountId) {
                throw new Error('Selecione uma conta bancária.')
            }

            if (isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
                throw new Error('Informe um valor total maior que zero.')
            }

            let installmentTotalNumber: number | undefined

            if (desiredMonthlyPaymentNumber !== null) {
                // Nesse modo o servidor calcula o nº de parcelas de verdade (com juros compostos).
                if (fixedPaymentPlan?.insufficient) {
                    throw new Error('Esse pagamento mensal não cobre nem os juros do primeiro mês, a dívida nunca seria quitada.')
                }
            } else {
                installmentTotalNumber = parseInt(installmentTotal, 10)

                if (isNaN(installmentTotalNumber) || installmentTotalNumber < 1) {
                    throw new Error('Informe um número de parcelas válido.')
                }
            }

            const response = await apiCreateLoan({
                bankAccountId: Number(bankAccountId),
                description: normalizedDescription,
                totalAmount: totalAmountNumber,
                installmentTotal: installmentTotalNumber,
                dueDay: dueDayNumber,
                interestRate: interestRateNumber,
                desiredMonthlyPayment: desiredMonthlyPaymentNumber,
                startDate: startDate.toISOString(),
            })

            if (!response.success) {
                throw new Error(response.message || 'Erro ao salvar empréstimo. Tente novamente mais tarde.')
            }

            toast.success('Empréstimo cadastrado com sucesso! As parcelas já foram lançadas como pendentes.')
            closed(true)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Erro ao salvar empréstimo. Tente novamente mais tarde.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent ref={dialogContentRef} className="sm:max-w-lg md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar empréstimo' : 'Novo empréstimo'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Valor, nº de parcelas e conta não podem ser alterados após a criação.'
                            : 'Ao cadastrar, as parcelas são lançadas automaticamente como pendentes.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 w-full">
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
                                        <DecimalInput
                                            id="loan-total-amount"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="loan-installment-total">Nº de parcelas</FieldLabel>
                                <Controller
                                    name="installmentTotal"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <IntegerInput
                                            id="loan-installment-total"
                                            placeholder="12"
                                            value={value}
                                            onChange={onChange}
                                            disabled={!!watchedDesiredMonthlyPayment.trim()}
                                        />
                                    )}
                                />
                                {!!watchedDesiredMonthlyPayment.trim() && (
                                    <p className="text-xs text-muted-foreground">Calculado a partir do pagamento mensal desejado.</p>
                                )}
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
                            <FieldLabel htmlFor="loan-interest-rate">Taxa ao mês</FieldLabel>
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
                            <FieldLabel htmlFor="loan-desired-monthly-payment">Pagamento mensal desejado (opcional)</FieldLabel>
                            <Controller
                                name="desiredMonthlyPayment"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <DecimalInput
                                        id="loan-desired-monthly-payment"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        </Field>
                    )}

                    {!isEditing && fixedPaymentPlan?.insufficient && (
                        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            Esse valor não cobre nem os juros do primeiro mês — a dívida nunca seria quitada. Aumente o pagamento mensal.
                        </p>
                    )}

                    {!isEditing && fixedPaymentPlan && !fixedPaymentPlan.insufficient && (
                        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nº de parcelas necessárias</p>
                                <p className="font-medium">{fixedPaymentPlan.months}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Última parcela</p>
                                <p className="font-medium">{currencyFormatter.format(fixedPaymentPlan.lastInstallment)}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">
                                    Total pago: <span className="text-stone-900">{currencyFormatter.format(fixedPaymentPlan.totalPaid)}</span> ·
                                    Juros: <span className="text-orange-600">{currencyFormatter.format(fixedPaymentPlan.totalInterest)}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {!isEditing && installmentEstimate && (
                        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Parcela estimada</p>
                                <p className="font-medium">{currencyFormatter.format(installmentEstimate.installmentAmount)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Total a pagar</p>
                                <p className="font-medium">{currencyFormatter.format(installmentEstimate.totalAmount)}</p>
                            </div>
                            {installmentEstimate.totalInterest > 0.004 && (
                                <div className="col-span-2">
                                    <p className="text-muted-foreground">
                                        Total de juros: {currencyFormatter.format(installmentEstimate.totalInterest)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {!isEditing && (
                        <Field>
                            <FieldLabel htmlFor="loan-start-date">Data da contratação</FieldLabel>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <DateTimePicker id="loan-start-date" value={value} onChange={onChange} container={dialogContentRef} />
                                )}
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
