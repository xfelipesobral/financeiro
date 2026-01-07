import { Request, Response } from 'express'

import { TransactionService } from '../service'
import { TransactionFilterFindParams } from '../service/prisma'

interface Filters {
    initialDate?: string
    finalDate?: string
    bankAccountId?: string
    categoryId?: string
    type?: 'CREDIT' | 'DEBIT'
    page?: string
    limit?: string
}

export async function find(req: Request, res: Response) {
    const { id } = req.params as { id: string | undefined }
    const querys = req.query as Filters

    try {
        if (querys.type && !['CREDIT', 'DEBIT'].includes(querys.type)) {
            res.status(400).json({ message: 'Invalid type' })
            return
        }

        // Busca tranasacao especifica por id
        if (id) {
            const transaction = await new TransactionService().findById(id)

            if (!transaction || transaction.userId !== req.user.id) {
                res.status(204).json({ message: 'Transaction not found' })
                return
            }

            res.status(200).json(transaction)
            return
        }

        // Organiza filtros
        const filters = {} as TransactionFilterFindParams

        filters.take = Number(querys?.limit || 10)
        if (filters.take > 100) filters.take = 100

        filters.skip = (Number(querys?.page || 1) - 1) * filters.take

        if (querys.initialDate) filters.initialDate = new Date(querys.initialDate)
        if (querys.finalDate) filters.finalDate = new Date(querys.finalDate)

        if (querys.categoryId) filters.categoryId = Number(querys.categoryId)

        if (querys.type) filters.type = querys.type

        // Busca transacoes do usuario
        const transactions = await new TransactionService().findByUserId(req.user.id, filters)

        res.status(200).json(transactions)
        return
    } catch (e) {
        res.status(500).json({ message: (e as Error).message })
        return
    }
}
