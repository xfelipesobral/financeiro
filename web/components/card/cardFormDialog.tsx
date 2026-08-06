'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateCard from '@/api/card/create'
import apiUpdateCard from '@/api/card/update'
import { DecimalInput, IntegerInput } from '@/components/inputs/maskedInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CARD_TYPES: { value: CardType; label: string }[] = [
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'DEBIT', label: 'Débito' },
    { value: 'CREDIT_AND_DEBIT', label: 'Crédito e débito' },
]

interface Params {
    open: boolean
    bankAccounts: BankAccount[]
    card?: Card | null
    closed: (update?: boolean) => void
}

interface Form {
    bankAccountId: string
    name: string
    closingDay: string
    type: CardType | ''
    description: string
    limit: string
}

const emptyForm: Form = {
    bankAccountId: '',
    name: '',
    closingDay: '',
    type: '',
    description: '',
    limit: '',
}

export function CardFormDialog({ open, bankAccounts, card, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const isEditing = !!card

    const { control, handleSubmit, register, reset } = useForm<Form>({ defaultValues: emptyForm })

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        reset(
            card
                ? {
                      bankAccountId: String(card.bankAccountId),
                      name: card.name,
                      closingDay: String(card.closingDay),
                      type: card.type,
                      description: card.description,
                      limit: String(card.limit),
                  }
                : emptyForm,
        )
    }, [open, card, reset])

    const onSubmit = async ({ bankAccountId, name, closingDay, type, description, limit }: Form) => {
        const normalizedName = name.trim()
        const normalizedDescription = description.trim()
        const closingDayNumber = parseInt(closingDay, 10)
        const limitNumber = parseFloat(limit)

        if (!bankAccountId) {
            toast.error('Selecione uma conta bancária.')
            return
        }

        if (!normalizedName) {
            toast.error('Nome do cartão é obrigatório.')
            return
        }

        if (!type) {
            toast.error('Selecione o tipo do cartão.')
            return
        }

        if (isNaN(closingDayNumber) || closingDayNumber < 1 || closingDayNumber > 31) {
            toast.error('Informe um dia de fechamento entre 1 e 31.')
            return
        }

        if (isNaN(limitNumber) || limitNumber < 0) {
            toast.error('Informe um limite válido.')
            return
        }

        setLoading(true)

        const params = {
            bankAccountId: Number(bankAccountId),
            name: normalizedName,
            closingDay: closingDayNumber,
            type,
            description: normalizedDescription,
            limit: limitNumber,
        }

        const response = isEditing ? await apiUpdateCard(card!.id, params) : await apiCreateCard(params)

        if (!response.success) {
            toast.error(response.message || 'Erro ao salvar cartão. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success(isEditing ? 'Cartão atualizado com sucesso!' : 'Cartão cadastrado com sucesso!')
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
                    <DialogTitle>{isEditing ? 'Editar cartão' : 'Novo cartão'}</DialogTitle>
                    <DialogDescription>Cadastre o cartão vinculado a uma conta bancária.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="card-bank-account">Conta bancária</FieldLabel>
                        <Controller
                            name="bankAccountId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="card-bank-account" className="w-full">
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
                        <FieldLabel htmlFor="card-name">Nome</FieldLabel>
                        <Input id="card-name" type="text" placeholder="Nubank Ultravioleta" {...register('name')} />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldLabel htmlFor="card-type">Tipo</FieldLabel>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Select value={value} onValueChange={onChange}>
                                        <SelectTrigger id="card-type" className="w-full">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CARD_TYPES.map((cardType) => (
                                                <SelectItem key={cardType.value} value={cardType.value}>
                                                    {cardType.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="card-closing-day">Dia de fechamento</FieldLabel>
                            <Controller
                                name="closingDay"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <IntegerInput id="card-closing-day" placeholder="10" value={value} onChange={onChange} />
                                )}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="card-limit">Limite</FieldLabel>
                        <Controller
                            name="limit"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DecimalInput id="card-limit" inputMode="decimal" placeholder="0.00" value={value} onChange={onChange} />
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="card-description">Descrição</FieldLabel>
                        <Input id="card-description" type="text" placeholder="Cartão principal" {...register('description')} />
                    </Field>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                            {isEditing ? 'Salvar alterações' : 'Cadastrar cartão'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
