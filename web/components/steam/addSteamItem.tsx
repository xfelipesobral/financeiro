'use client'

import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateSteamInventoryItem from '@/api/steam/itens/createItem'
import { DecimalInput } from '@/components/inputs/maskedInput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface Params {
    open: boolean
    closed: (update?: boolean) => void
}

interface Form {
    name: string
    marketHashName: string
    imageUrl: string
    initialPaidPrice: string
}

export function AddSteamItem({ open, closed }: Params) {
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, register, reset } = useForm<Form>({
        defaultValues: {
            name: '',
            marketHashName: '',
            imageUrl: '',
            initialPaidPrice: '',
        },
    })

    useEffect(() => {
        if (!open) {
            setLoading(false)
            reset()
        }
    }, [open, reset])

    const onSubmit = async ({ name, marketHashName, imageUrl, initialPaidPrice }: Form) => {
        const normalizedName = name.trim()
        const normalizedMarketHashName = marketHashName.trim()
        const normalizedImageUrl = imageUrl.trim()
        const normalizedInitialPaidPrice = initialPaidPrice.trim()
        const paidPrice = normalizedInitialPaidPrice ? parseFloat(normalizedInitialPaidPrice) : null

        if (!normalizedName) {
            toast.error('Nome do item é obrigatório.')
            return
        }

        if (!normalizedMarketHashName) {
            toast.error('Market hash name é obrigatório.')
            return
        }

        if (!normalizedImageUrl) {
            toast.error('Link da imagem é obrigatório.')
            return
        }

        if (!isValidHttpUrl(normalizedImageUrl)) {
            toast.error('Informe um link de imagem válido.')
            return
        }

        if (paidPrice !== null && (isNaN(paidPrice) || paidPrice <= 0)) {
            toast.error('O valor pago inicial precisa ser maior que zero.')
            return
        }

        setLoading(true)

        const response = await apiCreateSteamInventoryItem({
            name: normalizedName,
            marketHashName: normalizedMarketHashName,
            imageUrl: normalizedImageUrl,
            initialPaidPrice: paidPrice,
        })

        if (!response.success) {
            toast.error(response.message || 'Erro ao adicionar item. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success('Item adicionado com sucesso!')
        closed(true)
    }

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
                    <DialogTitle>Adicionar Item</DialogTitle>
                    <DialogDescription>Cadastre manualmente um item Steam no inventário.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="steam-item-name">Nome</FieldLabel>
                        <Input id="steam-item-name" type="text" placeholder="AK-47 | Redline" {...register('name')} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="steam-item-market-hash-name">Market hash name</FieldLabel>
                        <Input id="steam-item-market-hash-name" type="text" placeholder="AK-47 | Redline (Field-Tested)" {...register('marketHashName')} />
                        <FieldDescription>Nome do item no mercado da Steam, usado para buscar o preço atualizado.</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="steam-item-image-url">Link da imagem</FieldLabel>
                        <Input id="steam-item-image-url" type="url" placeholder="https://..." {...register('imageUrl')} />
                        <FieldDescription>Use o link da imagem obtido manualmente no mercado da Steam.</FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="steam-item-initial-paid-price">Valor pago inicial</FieldLabel>
                        <Controller
                            name="initialPaidPrice"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <DecimalInput
                                    id="steam-item-initial-paid-price"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={value}
                                    onChange={onChange}
                                />
                            )}
                        />
                        <FieldDescription>Opcional. Quando informado, será criada uma compra com quantidade 1.</FieldDescription>
                    </Field>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                            Adicionar item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function isValidHttpUrl(value: string) {
    try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}
