'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'

import apiGetCards from '@/api/card/list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const CARD_TYPE_LABELS: Record<CardType, string> = {
    CREDIT: 'Crédito',
    DEBIT: 'Débito',
    CREDIT_AND_DEBIT: 'Crédito e débito',
}

interface Params {
    onEdit: (card: Card) => void
    onDelete: (card: Card) => void
}

export function CardsList({ onEdit, onDelete }: Params) {
    const [cards, setCards] = useState<Card[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCards()
    }, [])

    const fetchCards = async () => {
        setLoading(true)

        const response = await apiGetCards()

        if (!response.success) {
            toast.error(response.message || 'Erro ao buscar cartões')
            setLoading(false)
            return
        }

        setCards(response.data || [])
        setLoading(false)
    }

    if (!loading && !cards.length) {
        return <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado ainda.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Conta bancária</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fechamento</TableHead>
                    <TableHead>Limite</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cards.map((card) => (
                    <TableRow key={card.id}>
                        <TableCell>{card.name}</TableCell>
                        <TableCell>
                            {card.bankAccount.bank.name} · {card.bankAccount.description || card.bankAccount.accountNumber}
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">{CARD_TYPE_LABELS[card.type]}</Badge>
                        </TableCell>
                        <TableCell>Dia {card.closingDay}</TableCell>
                        <TableCell>{card.limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(card)}>
                                <Pencil />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(card)}>
                                <Trash2 />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
