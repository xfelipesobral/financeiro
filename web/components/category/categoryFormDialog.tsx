'use client'

import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

import apiCreateCategory from '@/api/category/create'
import apiUpdateCategory from '@/api/category/update'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CATEGORY_TYPES: { value: CategoryType; label: string }[] = [
    { value: 'DEBIT', label: 'Débito' },
    { value: 'CREDIT', label: 'Crédito' },
]

interface Params {
    open: boolean
    categories: Category[]
    category?: Category | null
    initialParentId?: number | null
    closed: (update?: boolean) => void
}

interface Form {
    description: string
    type: CategoryType | ''
    parentId: string
}

const emptyForm: Form = {
    description: '',
    type: '',
    parentId: '',
}

export function CategoryFormDialog({ open, categories, category, initialParentId, closed }: Params) {
    const [loading, setLoading] = useState(false)
    const isEditing = !!category

    const { control, handleSubmit, register, reset } = useForm<Form>({ defaultValues: emptyForm })

    // Só categorias suas (não do sistema) e que sejam elas mesmas uma categoria base podem ser pai —
    // mantém a hierarquia em 2 níveis. Uma categoria não pode ser pai dela mesma.
    const baseCategoryOptions = useMemo(
        () => categories.filter((current) => current.userId !== null && !current.parentId && current.id !== category?.id),
        [categories, category],
    )

    useEffect(() => {
        if (!open) {
            setLoading(false)
            return
        }

        reset(
            category
                ? {
                      description: category.description,
                      type: category.type as CategoryType,
                      parentId: category.parentId ? String(category.parentId) : '',
                  }
                : { ...emptyForm, parentId: initialParentId ? String(initialParentId) : '' },
        )
    }, [open, category, initialParentId, reset])

    const onSubmit = async ({ description, type, parentId }: Form) => {
        const normalizedDescription = description.trim()

        if (!normalizedDescription) {
            toast.error('Descrição da categoria é obrigatória.')
            return
        }

        if (!type) {
            toast.error('Selecione o tipo da categoria.')
            return
        }

        setLoading(true)

        const params = {
            description: normalizedDescription,
            type,
            parentId: parentId ? Number(parentId) : null,
        }

        const response = isEditing ? await apiUpdateCategory(category!.id, params) : await apiCreateCategory(params)

        if (!response.success) {
            toast.error(response.message || 'Erro ao salvar categoria. Tente novamente mais tarde.')
            setLoading(false)
            return
        }

        toast.success(isEditing ? 'Categoria atualizada com sucesso!' : 'Categoria cadastrada com sucesso!')
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
                    <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
                    <DialogDescription>
                        Deixe "Categoria pai" vazio para criar uma categoria base, ou escolha uma pra criar uma subcategoria.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <Field>
                        <FieldLabel htmlFor="category-description">Descrição</FieldLabel>
                        <Input id="category-description" type="text" placeholder="Mercado" {...register('description')} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="category-type">Tipo</FieldLabel>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value} onValueChange={onChange}>
                                    <SelectTrigger id="category-type" className="w-full">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_TYPES.map((categoryType) => (
                                            <SelectItem key={categoryType.value} value={categoryType.value}>
                                                {categoryType.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="category-parent">Categoria pai</FieldLabel>
                        <Controller
                            name="parentId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select value={value || 'none'} onValueChange={(next) => onChange(next === 'none' ? '' : next)}>
                                    <SelectTrigger id="category-parent" className="w-full">
                                        <SelectValue placeholder="Nenhuma (categoria base)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Nenhuma (categoria base)</SelectItem>
                                        {baseCategoryOptions.map((baseCategory) => (
                                            <SelectItem key={baseCategory.id} value={String(baseCategory.id)}>
                                                {baseCategory.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </Field>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
                            {isEditing ? 'Salvar alterações' : 'Cadastrar categoria'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
