'use client'

import { comboBanksList } from '@/api/bank/list'
import { Combobox } from '@/components/input/combobox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface Form {
    bank: ComboboxItem
    description: string
}

export function BankAccount() {
    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(false)
    const [banks, setBanks] = useState<ComboboxItem[]>([])

    const { control, setValue, getValues, register, reset, resetField } = useForm<Form>()

    useEffect(() => {
        if (open) {
            reset()
            if (banks.length === 0) comboBanksList({}).then(setBanks)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] w-full">
                <DialogHeader>
                    <DialogTitle>Nova conta de banco</DialogTitle>
                    <DialogDescription>Adicione uma nova conta de banco para registrar suas movimentações financeiras.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Controller
                        name="bank"
                        control={control}
                        render={({ field: { name, value, onChange } }) => (
                            <Combobox id={name} list={banks} selected={value} onChange={onChange} title="Banco" />
                        )}
                    />

                    <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input id="descricao" placeholder="Descrição da conta" {...register('description')} />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={() => {}} type="submit">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar mudanças
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
