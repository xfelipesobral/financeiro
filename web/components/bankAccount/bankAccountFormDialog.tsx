'use client'

import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateBankAccount from '@/api/bankAccount/create'
import apiUpdateBankAccount from '@/api/bankAccount/update'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PIX_KEY_TYPES = [
    { value: 'CPF', label: 'CPF' },
    { value: 'CNPJ', label: 'CNPJ' },
    { value: 'EMAIL', label: 'E-mail' },
    { value: 'PHONE', label: 'Telefone' },
    { value: 'RANDOM', label: 'Chave aleatória' },
]

interface Params {
    open: boolean
    banks: Bank[]
    bankAccount?: BankAccount | null
    closed: (update?: boolean) => void
}

interface Form {
    bankId: string
    branchCode: string
    accountNumber: string
    description: string
    pixKeys: { type: string; value: string }[]
}

const emptyForm: Form = {
    bankId: '',
    branchCode: '',
    accountNumber: '',
    description: '',
    pixKeys: [],
}

export function BankAccountFormDialog({ open, banks, bankAccount, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const isEditing = !!bankAccount

    const { control, handleSubmit, register, reset } = useForm<Form>({ defaultValues: emptyForm })
    const { fields, append, remove } = useFieldArray({ control, name: 'pixKeys' })

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        reset(
            bankAccount
                ? {
                      bankId: String(bankAccount.bankId),
                      branchCode: bankAccount.branchCode,
                      accountNumber: bankAccount.accountNumber,
                      description: bankAccount.description || '',
                      pixKeys: bankAccount.pixs.map((pix) => ({ type: pix.type, value: pix.value })),
                  }
                : emptyForm,
        )
    }, [open, bankAccount, reset])

    const onSubmit = async ({ bankId, branchCode, accountNumber, description, pixKeys }: Form) => {
        const normalizedBranchCode = branchCode.trim()
        const normalizedAccountNumber = accountNumber.trim()
        const normalizedDescription = description.trim()

        if (!bankId) {
            toast.error('Selecione um banco.')
            return
        }

        if (!normalizedBranchCode) {
            toast.error('Agência é obrigatória.')
            return
        }

        if (!normalizedAccountNumber) {
            toast.error('Número da conta é obrigatório.')
            return
        }

        for (const pixKey of pixKeys) {
            if (!pixKey.type || !pixKey.value.trim()) {
                toast.error('Preencha o tipo e o valor de todas as chaves Pix, ou remova as vazias.')
                return
            }
        }

        setLoading(true)

        const params = {
            bankId: Number(bankId),
            branchCode: normalizedBranchCode,
            accountNumber: normalizedAccountNumber,
            description: normalizedDescription || undefined,
            pixKeys: pixKeys.map((pixKey) => ({ type: pixKey.type, value: pixKey.value.trim() })),
        }

        const response = isEditing ? await apiUpdateBankAccount(bankAccount!.id, params) : await apiCreateBankAccount(params)

        if (!response.success) {
            toast.error(response.message || 'Erro ao salvar conta bancária. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success(isEditing ? 'Conta bancária atualizada com sucesso!' : 'Conta bancária cadastrada com sucesso!')
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
                    <DialogTitle>{isEditing ? 'Editar conta bancária' : 'Nova conta bancária'}</DialogTitle>
                    <DialogDescription>Cadastre o banco, agência, conta e as chaves Pix associadas.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="bank-account-bank">Banco</FieldLabel>
                        <Controller
                            name="bankId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="bank-account-bank" className="w-full">
                                        <SelectValue placeholder="Selecione um banco" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {banks.map((bankOption) => (
                                            <SelectItem key={bankOption.id} value={String(bankOption.id)}>
                                                {bankOption.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldLabel htmlFor="bank-account-branch-code">Agência</FieldLabel>
                            <Input id="bank-account-branch-code" type="text" placeholder="0001" {...register('branchCode')} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="bank-account-number">Conta</FieldLabel>
                            <Input id="bank-account-number" type="text" placeholder="00000-0" {...register('accountNumber')} />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="bank-account-description">Descrição</FieldLabel>
                        <Input id="bank-account-description" type="text" placeholder="Conta corrente principal" {...register('description')} />
                    </Field>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <FieldLabel>Chaves Pix</FieldLabel>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ type: 'EMAIL', value: '' })}>
                                <Plus /> Adicionar chave
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Controller
                                    name={`pixKeys.${index}.type`}
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select value={value} onValueChange={onChange}>
                                            <SelectTrigger className="w-36">
                                                <SelectValue placeholder="Tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PIX_KEY_TYPES.map((pixKeyType) => (
                                                    <SelectItem key={pixKeyType.value} value={pixKeyType.value}>
                                                        {pixKeyType.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <Input placeholder="Valor da chave" {...register(`pixKeys.${index}.value`)} />
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                            {isEditing ? 'Salvar alterações' : 'Cadastrar conta'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
