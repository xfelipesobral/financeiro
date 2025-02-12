import { Request, Response } from 'express'

import { TransactionService } from '../service'
import { TransactionFilterFindParams } from '../service/prisma'

interface Filters {
    initialDate?: string
    finalDate?: string
    bankId?: string
    categoryId?: string
    type?: 'CREDIT' | 'DEBIT'
}

export async function total(req: Request, res: Response) {
    const querys = req.query as Filters

    try {
        if (querys.type && !['CREDIT', 'DEBIT'].includes(querys.type)) {
            res.status(400).json({ message: 'Invalid type' })
            return
        }

        // Organiza filtros
        const filters = {} as TransactionFilterFindParams

        if (querys.initialDate) filters.initialDate = new Date(querys.initialDate)
        if (querys.finalDate) filters.finalDate = new Date(querys.finalDate)

        if (querys.bankId) filters.bankId = Number(querys.bankId)
        if (querys.categoryId) filters.categoryId = Number(querys.categoryId)

        if (querys.type) filters.type = querys.type

        // Calcula total
        const values = await new TransactionService().totalByUserId(req.user.id, filters)

        res.status(200).json(values)
        return
    } catch (e) {
        res.status(500).json({ message: (e as Error).message })
        return
    }
}
