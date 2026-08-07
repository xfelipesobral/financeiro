'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CalendarClock, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateTransaction, { ApiCreateTransactionParams } from '@/api/transaction/create'
import apiUpdateTransaction from '@/api/transaction/update'
import { DateTimePicker } from '@/components/inputs/dateTimePicker'
import { DecimalInput, IntegerInput } from '@/components/inputs/maskedInput'
import { Button } from '@/components/ui/button'
import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
} from '@/components/ui/combobox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryOption, CategoryOptionGroup, groupCategoriesByBase } from '@/components/category/groupCategoriesByBase'

// Guids fixos das formas de pagamento (ver api/src/db/seed.ts). O meio de pagamento
// escolhido é quem decide se o formulário pede conta bancária ou cartão+parcelas —
// não existe um campo separado pra isso.
const CREDIT_CARD_PAYMENT_METHOD_GUID = 'cartao-credito'
const LOAN_PAYMENT_METHOD_GUID = 'emprestimo'

interface Params {
    open: boolean
    bankAccounts: BankAccount[]
    categories: Category[]
    cards: Card[]
    paymentMethods: PaymentMethod[]
    transaction?: Transaction | null
    closed: (update?: boolean) => void
}

interface Form {
    bankAccountId: string
    cardId: string
    installmentTotal: string
    paymentMethodId: string
    categoryId: string
    totalAmount: string
    description: string
    date: Date
}

const emptyForm: Form = {
    bankAccountId: '',
    cardId: '',
    installmentTotal: '1',
    paymentMethodId: '',
    categoryId: '',
    totalAmount: '',
    description: '',
    date: new Date(),
}

export function TransactionFormDialog({ open, bankAccounts, categories, cards, paymentMethods, transaction, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const dialogContentRef = useRef<HTMLDivElement>(null)
    const isEditing = !!transaction

    const { control, handleSubmit, register, watch, reset } = useForm<Form>({ defaultValues: emptyForm })
    const paymentMethodId = watch('paymentMethodId')
    const date = watch('date')

    // Empréstimo não é escolhido aqui: as parcelas dele nascem junto com o próprio empréstimo.
    const selectablePaymentMethods = useMemo(
        () => paymentMethods.filter((paymentMethod) => paymentMethod.guid !== LOAN_PAYMENT_METHOD_GUID),
        [paymentMethods],
    )

    const isCreditCard = useMemo(
        () => paymentMethods.find((paymentMethod) => String(paymentMethod.id) === paymentMethodId)?.guid === CREDIT_CARD_PAYMENT_METHOD_GUID,
        [paymentMethods, paymentMethodId],
    )

    // Mesma regra do backend (buildTransactionPayments): fora do cartão, data futura vira lançamento
    // agendado (PENDING) em vez de já entrar pago — comparação por dia, não por instante.
    const isScheduled = useMemo(() => {
        if (isCreditCard || !date) return false

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const chosenDay = new Date(date)
        chosenDay.setHours(0, 0, 0, 0)

        return chosenDay > today
    }, [isCreditCard, date])

    // Categorias do sistema (userId null — empréstimo, fatura de cartão, transferência) não aparecem
    // aqui: só podem ser usadas pelos fluxos dedicados, montar uma transação manual com elas quebraria
    // a marcação usada por relatórios de gasto/receita. Agrupado por categoria base — sem `includeBase`,
    // só subcategorias específicas são selecionáveis, a base vira só cabeçalho visual do grupo.
    const categoryGroups: CategoryOptionGroup[] = useMemo(() => groupCategoriesByBase(categories), [categories])
    const categoryOptions = useMemo(() => categoryGroups.flatMap((group) => group.items), [categoryGroups])

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        if (transaction) {
            const firstPayment = transaction.payments?.[0]

            reset({
                bankAccountId: String(transaction.bankAccountId),
                cardId: firstPayment?.cardId ? String(firstPayment.cardId) : '',
                installmentTotal: String(transaction.installmentTotal || 1),
                paymentMethodId: firstPayment ? String(firstPayment.paymentMethodId) : '',
                categoryId: String(transaction.categoryId),
                totalAmount: String(transaction.totalAmount),
                description: transaction.description,
                date: new Date(transaction.date),
            })
        } else {
            reset({ ...emptyForm, date: new Date() })
        }
    }, [open, transaction, reset])

    const onSubmit = async ({ bankAccountId, cardId, installmentTotal, paymentMethodId, categoryId, totalAmount, description, date }: Form) => {
        const normalizedDescription = description.trim()
        const amount = parseFloat(totalAmount)

        if (!paymentMethodId) {
            toast.error('Selecione uma forma de pagamento.')
            return
        }

        if (isCreditCard && !cardId) {
            toast.error('Selecione um cartão.')
            return
        }

        if (!isCreditCard && !bankAccountId) {
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

        let installmentTotalNumber: number | undefined

        if (isCreditCard) {
            installmentTotalNumber = parseInt(installmentTotal || '1', 10)

            if (isNaN(installmentTotalNumber) || installmentTotalNumber < 1) {
                toast.error('Número de parcelas inválido.')
                return
            }
        }

        setLoading(true)

        const params: ApiCreateTransactionParams = {
            categoryId: Number(categoryId),
            totalAmount: amount,
            description: normalizedDescription,
            date: date.toISOString(),
            paymentMethodId: Number(paymentMethodId),
            ...(isCreditCard
                ? { cardId: Number(cardId), installmentTotal: installmentTotalNumber }
                : { bankAccountId: Number(bankAccountId) }),
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
                        <FieldLabel htmlFor="transaction-payment-method">Forma de pagamento</FieldLabel>
                        <Controller
                            name="paymentMethodId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="transaction-payment-method" className="w-full">
                                        <SelectValue placeholder="Selecione a forma de pagamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectablePaymentMethods.map((paymentMethod) => (
                                            <SelectItem key={paymentMethod.id} value={String(paymentMethod.id)}>
                                                {paymentMethod.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    {isCreditCard ? (
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel htmlFor="transaction-card">Cartão</FieldLabel>
                                <Controller
                                    name="cardId"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select value={value} onValueChange={onChange}>
                                            <SelectTrigger id="transaction-card" className="w-full">
                                                <SelectValue placeholder="Selecione um cartão" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cards.map((card) => (
                                                    <SelectItem key={card.id} value={String(card.id)}>
                                                        {card.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="transaction-installment-total">Parcelas</FieldLabel>
                                <Controller
                                    name="installmentTotal"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <IntegerInput id="transaction-installment-total" placeholder="1" value={value} onChange={onChange} />
                                    )}
                                />
                            </Field>
                        </div>
                    ) : (
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
                    )}

                    <Field>
                        <FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Combobox
                                    items={categoryGroups}
                                    value={categoryOptions.find((option) => option.value === value) ?? null}
                                    onValueChange={(option) => onChange(option ? option.value : '')}>
                                    <ComboboxInput id="transaction-category" className="w-full" placeholder="Selecione uma categoria" />
                                    <ComboboxContent container={dialogContentRef}>
                                        <ComboboxEmpty>Nenhuma categoria encontrada.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(group: CategoryOptionGroup) => (
                                                <ComboboxGroup key={group.value} items={group.items}>
                                                    <ComboboxLabel>{group.value}</ComboboxLabel>
                                                    <ComboboxCollection>
                                                        {(option: CategoryOption) => (
                                                            <ComboboxItem key={option.value} value={option}>
                                                                {option.label}
                                                            </ComboboxItem>
                                                        )}
                                                    </ComboboxCollection>
                                                </ComboboxGroup>
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
                        {isScheduled && (
                            <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                <CalendarClock className="mt-0.5 size-4 shrink-0" />
                                Como a data é futura, esse lançamento ficará pendente (agendado) e só vai contar no saldo da conta depois que
                                você der o aceite em Contas a pagar.
                            </p>
                        )}
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
