'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleCheck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import apiPayPayment from '@/api/payment/pay'
import { DatePicker } from '@/components/inputs/datePicker'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { numberToBrl } from '@/lib/formatNumber'
import { ScheduledPaymentGroup } from './groupPendingPayments'

interface Params {
    scheduled: ScheduledPaymentGroup | null
    closed: (update?: boolean) => void
}

export function AcceptScheduledPaymentDialog({ scheduled, closed }: Params) {
    const open = !!scheduled
    const dialogContentRef = useRef<HTMLDivElement>(null)

    const [loading, setLoading] = useState(false)
    const [paidAt, setPaidAt] = useState<Date>(new Date())

    useEffect(() => {
        setLoading(false)
        setPaidAt(new Date())
    }, [scheduled])

    const onSubmit = async () => {
        if (!scheduled) return

        setLoading(true)

        const response = await apiPayPayment(scheduled.payment.id, { paidAt: paidAt.toISOString() })

        if (response.success) {
            toast.success('Pagamento aceito com sucesso!')
            closed(true)
        } else {
            toast.error(response.message || 'Erro ao aceitar pagamento. Tente novamente mais tarde.')
        }

        setLoading(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent ref={dialogContentRef} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Aceitar pagamento agendado</DialogTitle>
                    <DialogDescription>
                        Confirma que esse pagamento realmente aconteceu. A partir do aceite ele passa a contar no saldo da conta.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-1 text-sm">
                    <p className="font-medium">{scheduled?.payment.transaction.description}</p>
                    <p className="text-muted-foreground">{numberToBrl(scheduled?.totalAmount ?? 0)}</p>
                </div>

                <Field>
                    <FieldLabel htmlFor="accept-scheduled-paid-at">Data efetiva do pagamento</FieldLabel>
                    <DatePicker id="accept-scheduled-paid-at" value={paidAt} onChange={setPaidAt} container={dialogContentRef} />
                </Field>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closed()} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={onSubmit} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <CircleCheck />}
                        Aceitar pagamento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
