'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Params {
    transaction?: Transaction | null
    closed: () => void
}

const statusLabel: Record<PaymentStatus, string> = {
    PAID: 'Pago',
    PENDING: 'Pendente',
    OVERDUE: 'Vencido',
    CANCELED: 'Cancelado',
}

const statusVariant: Record<PaymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    PAID: 'default',
    PENDING: 'secondary',
    OVERDUE: 'destructive',
    CANCELED: 'outline',
}

export function TransactionPaymentsDialog({ transaction, closed }: Params) {
    const open = !!transaction

    const payments = [...(transaction?.payments ?? [])].sort((a, b) => (a.installmentNumber ?? 0) - (b.installmentNumber ?? 0))
    const paidCount = payments.filter((payment) => payment.status === 'PAID').length

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) closed()
            }}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Pagamentos do lançamento</DialogTitle>
                    <DialogDescription>
                        {transaction?.description}{' '}
                        {payments.length > 1 && (
                            <span>
                                {paidCount}/{payments.length} parcelas pagas
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Parcela</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Pago em</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.installmentNumber ?? 'Única'}</TableCell>
                                    <TableCell>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                                    <TableCell>{payment.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[payment.status]}>{statusLabel[payment.status]}</Badge>
                                    </TableCell>
                                    <TableCell>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('pt-BR') : '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={closed}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
