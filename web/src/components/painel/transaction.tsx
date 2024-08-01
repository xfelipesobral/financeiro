'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, PiggyBank } from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { Combobox } from '../input/combobox'
import { comboBanksList } from '@/api/bank/list'
import { comboCategoryList } from '@/api/category/list'
import { Controller, useForm } from 'react-hook-form'
import { SelectDate } from '../input/date'
import { newTransaction } from '@/api/transaction/new'

interface Params {
    id?: string
    reloadTransactions?: () => void
}

interface Form {
    bank: ComboboxItem
    category: ComboboxItem
    description: string
    date: Date
    amount: string
}

const tabTriggerClassName = 'py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow'

export function Transaction({ id, reloadTransactions }: Params) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState<CategoryType>('DEBIT')
    const [banks, setBanks] = useState<ComboboxItem[]>([])
    const [categories, setCategories] = useState<ComboboxItem[]>([])

    const { control, setValue, getValues, register, reset, resetField } = useForm<Form>({
        defaultValues: {
            date: new Date()
        }
    })

    useEffect(() => {
        if (open) {
            reset()
            if (banks.length === 0) comboBanksList({}).then(setBanks)
        }
    }, [open])

    useEffect(() => {
        if (open) {
            resetField('category')
            comboCategoryList({ type }).then(setCategories)
        }
    }, [open, type])

    const handleSubmit = async () => {
        const { amount, bank, category, date, description } = getValues()

        const amountNumber = Number((amount || '0').replace(',', '.').replace(/[^0-9.]/g, '') || '0')

        if (amountNumber === 0) return toast.error('Valor é obrigatório e deve ser maior que zero')
        if (!bank) return toast.error('Banco é obrigatório')
        if (!category) return toast.error('Categoria é obrigatória')

        setLoading(true)
        const newTransactionResponse = await newTransaction({
            amount: amountNumber,
            bankId: Number(bank.value),
            categoryId: Number(category.value),
            date: date.toJSON(),
            description
        })
        setLoading(false)

        if (newTransactionResponse) return toast.error(newTransactionResponse)

        if (reloadTransactions) reloadTransactions()
        toast.success('Transação criada com sucesso')
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Criar nova transação</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[600px] w-full'>
                <DialogHeader>
                    <DialogTitle>Nova transação</DialogTitle>
                    <DialogDescription className='max-w-[400px]'>
                        Preencha os campos abaixo para criar uma nova movimentação. Clique em salvar para confirmar.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4'>
                    <Tabs value={type} onValueChange={i => setType(i as CategoryType)}>
                        <TabsList className='w-full'>
                            <TabsTrigger className='w-full' value='DEBIT'>Saída</TabsTrigger>
                            <TabsTrigger className='w-full' value='CREDIT'>Entrada</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className='flex gap-4'>
                        <Controller
                            name='bank'
                            control={control}
                            render={({ field: { name, value, onChange } }) => (
                                <Combobox
                                    id={name}
                                    list={banks}
                                    selected={value}
                                    onChange={onChange}
                                    title='Banco'
                                />
                            )}
                        />

                        <Controller
                            name='category'
                            control={control}
                            render={({ field: { name, value, onChange } }) => (
                                <Combobox
                                    id={name}
                                    list={categories}
                                    selected={value}
                                    onChange={onChange}
                                    title='Categoria'
                                />
                            )}
                        />
                    </div>

                    <div className='flex gap-4'>
                        <div className='w-full flex flex-col gap-4'>
                            <Controller
                                name='date'
                                control={control}
                                render={({ field: { name, value, onChange } }) => (
                                    <SelectDate
                                        id={name}
                                        title='Data'
                                        selected={value}
                                        onChange={onChange}
                                    />
                                )}
                            />

                            <div>
                                <Label htmlFor='descricao'>Descrição</Label>
                                <Input
                                    id='descricao'
                                    placeholder='Descrição da movimentação'
                                    {...register('description')}
                                />
                            </div>
                        </div>
                        <div className='w-full flex flex-col bg-muted rounded-lg'>
                            <div className='p-4 flex items-center justify-center flex-col flex-1 gap-2'>
                                <div className='w-full flex flex-col items-center justify-center px-4'>
                                    <PiggyBank className='h-10 w-10 text-slate-800' />
                                    <div className='flex items-center justify-center gap-1'>
                                        <p className='tracking-tight text-sm font-medium'>Valor da transação</p>
                                        <p className='text-sm text-muted-foreground'>(R$)</p>
                                    </div>
                                </div>
                                <div className='w-full relative'>
                                    <Input
                                        className='text-lg font-bold text-center pl-6'
                                        type='number'
                                        step={1}
                                        placeholder='0'
                                        min={0}
                                        {...register('amount')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={handleSubmit} type='submit'>
                        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Salvar mudanças
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
