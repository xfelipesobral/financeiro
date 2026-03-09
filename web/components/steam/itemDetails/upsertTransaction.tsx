'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Field, FieldLabel } from '../../ui/field'
import { Button } from '../../ui/button'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { ApiSteamItemTransaction } from '@/api/steam/transactions/getItemTransactions'
import { useForm, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { DecimalInput, IntegerInput } from '@/components/inputs/maskedInput'
import apiSaveSteamItemTransaction from '@/api/steam/transactions/saveItemTransaction'
import { useItemDetails } from './context'

interface Params {
    transaction: ApiSteamItemTransaction | null
    closed: (update?: boolean) => void
}

export interface UpsertSteamItemTransactionForm {
    unitPrice: string
    quantity: string
    totalAmount: string
    type: 'BOUGHT' | 'SOLD'
    observation: string
}

export function UpsertSteamItemTransaction({ transaction, closed }: Params) {
    const open = transaction !== null

    const { id: itemId } = useItemDetails()

    const [loading, setLoading] = useState(false)

    const { control, getValues, setValue, reset, handleSubmit, register } = useForm<UpsertSteamItemTransactionForm>({
        defaultValues: {
            unitPrice: '',
            quantity: '',
            totalAmount: '',
            type: 'BOUGHT',
            observation: '',
        },
    })

    useEffect(() => {
        setLoading(false)

        reset({
            unitPrice: transaction?.unitPrice ? String(transaction.unitPrice) : '',
            quantity: transaction?.quantity ? String(transaction.quantity) : '',
            totalAmount: transaction?.totalAmount ? String(transaction.totalAmount) : '',
            type: transaction?.type || 'BOUGHT',
            observation: transaction?.observation || '',
        })
    }, [transaction])

    const calculateFields = (fieldUpdated: 'unitPrice' | 'quantity' | 'totalAmount') => {
        const { quantity, unitPrice, totalAmount } = getValues()

        const qty = parseInt(quantity)
        const unitPriceVal = parseFloat(unitPrice)
        const totalAmountVal = parseFloat(totalAmount)

        if (isNaN(qty) || qty <= 0) {
            return
        }

        if (unitPriceVal > 0 && fieldUpdated !== 'totalAmount') {
            setValue('totalAmount', (unitPriceVal * qty).toFixed(2))
            return
        }

        if (totalAmountVal > 0 && fieldUpdated !== 'unitPrice') {
            setValue('unitPrice', (totalAmountVal / qty).toFixed(2))
            return
        }
    }

    const onSaveTransaction = async ({ quantity, observation, totalAmount, type, unitPrice }: UpsertSteamItemTransactionForm) => {
        const qty = parseInt(quantity)
        const unitPriceVal = parseFloat(unitPrice)
        const totalAmountVal = parseFloat(totalAmount)

        if (qty <= 0 || unitPriceVal <= 0 || totalAmountVal <= 0) {
            toast.error('Quantidade, valor unitário e valor total precisam ser maiores que zero.')
            return
        }

        setLoading(true)

        const response = await apiSaveSteamItemTransaction(itemId, {
            id: transaction?.id,
            quantity: qty,
            observation,
            type,
            unitPrice: unitPriceVal,
        })

        if (response.success) {
            toast.success('Transação salva com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao salvar transação. Tente novamente mais tarde.')
        }

        setLoading(false)
    }

    const updating = transaction !== null && transaction.id > 0

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    closed()
                }
            }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{updating ? 'Editar Transação' : 'Adicionar Transação'}</DialogTitle>
                    <DialogDescription>Preencha os dados da movimentação para compra ou venda do item.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSaveTransaction)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="steam-transaction-type">Tipo de movimentação</FieldLabel>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <div
                                    className={cn(
                                        'flex overflow-hidden rounded-lg border divide-x font-semibold bg-stone-50 cursor-pointer select-none',
                                        updating ? 'pointer-events-none opacity-60' : '',
                                    )}>
                                    <div
                                        className={cn(
                                            'flex-1 p-2 flex items-center justify-center',
                                            value === 'BOUGHT' ? 'bg-radial from-green-50 to-green-100 text-green-800' : '',
                                        )}
                                        onClick={() => !updating && onChange('BOUGHT')}>
                                        <p>Compra</p>
                                    </div>
                                    <div
                                        className={cn(
                                            'flex-1 p-2 flex items-center justify-center',
                                            value === 'SOLD' ? 'bg-radial from-red-50 to-red-100 text-red-800' : '',
                                        )}
                                        onClick={() => !updating && onChange('SOLD')}>
                                        <p>Venda</p>
                                    </div>
                                </div>
                            )}
                        />
                    </Field>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="steam-transaction-quantity">Quantidade</FieldLabel>
                            <Controller
                                name="quantity"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <IntegerInput
                                        id="steam-transaction-quantity"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e)
                                            calculateFields('quantity')
                                        }}
                                    />
                                )}
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="steam-transaction-unit-price">Valor unitário</FieldLabel>
                            <Controller
                                name="unitPrice"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <DecimalInput
                                        id="steam-transaction-unit-price"
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e)
                                            calculateFields('unitPrice')
                                        }}
                                    />
                                )}
                            />
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="steam-transaction-total-amount">Valor total</FieldLabel>
                        <Controller
                            name="totalAmount"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DecimalInput
                                    id="steam-transaction-total-amount"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={value}
                                    onChange={(e) => {
                                        onChange(e)
                                        calculateFields('totalAmount')
                                    }}
                                />
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="steam-transaction-observation">Observação</FieldLabel>
                        <Textarea {...register('observation')} id="steam-transaction-observation" placeholder="Opcional" />
                    </Field>

                    <DialogFooter>
                        <Button disabled={loading} type="submit">
                            {loading ? <Loader2 className="animate-spin" /> : <Save />}
                            {(transaction?.id || 0) > 0 ? 'Salvar alterações' : 'Adicionar transação'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
