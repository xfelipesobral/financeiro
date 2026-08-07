'use client'

import { useMemo } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Field, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryOption, CategoryOptionGroup, groupCategoriesByBase } from '@/components/category/groupCategoriesByBase'

export type TransactionTypeFilter = 'ALL' | 'DEBIT' | 'CREDIT'

export interface TransactionFiltersValue {
    dateRange?: DateRange
    categoryId: string
    type: TransactionTypeFilter
}

export const emptyTransactionFilters: TransactionFiltersValue = {
    dateRange: undefined,
    categoryId: '',
    type: 'ALL',
}

interface Params {
    categories: Category[]
    value: TransactionFiltersValue
    onChange: (value: TransactionFiltersValue) => void
}

export function TransactionFilters({ categories, value, onChange }: Params) {
    // includeBase: aqui (diferente do formulário de lançamento) a categoria base continua
    // selecionável diretamente — útil pra achar lançamentos antigos categorizados assim.
    const categoryGroups: CategoryOptionGroup[] = useMemo(() => groupCategoriesByBase(categories, { includeBase: true }), [categories])
    const categoryOptions = useMemo(() => categoryGroups.flatMap((group) => group.items), [categoryGroups])

    const hasActiveFilters = !!value.dateRange?.from || !!value.categoryId || value.type !== 'ALL'

    return (
        <div className="flex flex-wrap items-end gap-3">
            <Field className="w-64">
                <FieldLabel htmlFor="transaction-filter-period">Período</FieldLabel>
                <Popover>
                    <PopoverTrigger
                        render={
                            <Button variant="outline" id="transaction-filter-period" className="w-full justify-start px-2.5 font-normal">
                                <CalendarIcon data-icon="inline-start" />
                                {value.dateRange?.from ? (
                                    value.dateRange.to ? (
                                        <>
                                            {format(value.dateRange.from, 'dd/MM/yy')} - {format(value.dateRange.to, 'dd/MM/yy')}
                                        </>
                                    ) : (
                                        format(value.dateRange.from, 'dd/MM/yy')
                                    )
                                ) : (
                                    <span className="text-muted-foreground">Todo o período</span>
                                )}
                            </Button>
                        }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            locale={ptBR}
                            defaultMonth={value.dateRange?.from}
                            selected={value.dateRange}
                            onSelect={(dateRange) => onChange({ ...value, dateRange })}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </Field>

            <Field className="w-64">
                <FieldLabel htmlFor="transaction-filter-category">Categoria</FieldLabel>
                <Combobox
                    items={categoryGroups}
                    value={categoryOptions.find((option) => option.value === value.categoryId) ?? null}
                    onValueChange={(option) => onChange({ ...value, categoryId: option ? option.value : '' })}>
                    <ComboboxInput id="transaction-filter-category" className="w-full" placeholder="Todas as categorias" />
                    <ComboboxContent>
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
            </Field>

            <Field className="w-44">
                <FieldLabel htmlFor="transaction-filter-type">Tipo</FieldLabel>
                <Select value={value.type} onValueChange={(type) => onChange({ ...value, type: type as TransactionTypeFilter })}>
                    <SelectTrigger id="transaction-filter-type" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        <SelectItem value="DEBIT">Somente débitos</SelectItem>
                        <SelectItem value="CREDIT">Somente créditos</SelectItem>
                    </SelectContent>
                </Select>
            </Field>

            {hasActiveFilters && (
                <Button variant="ghost" onClick={() => onChange(emptyTransactionFilters)}>
                    <X /> Limpar filtros
                </Button>
            )}
        </div>
    )
}
