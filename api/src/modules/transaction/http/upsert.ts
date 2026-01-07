import { Request, Response } from 'express'

import { CategoryService } from '../../category/service'

import { TransactionService } from '../service'
import { bankAccount } from '../../bankAccount/service'

interface TransactionParams {
    amount?: number
    bankAccountId?: string
    categoryId?: number
    date?: Date
    description?: string
}

export async function upsert(req: Request, res: Response) {
    const { amount, bankAccountId, categoryId, date, description } = req.body as TransactionParams
    const { id } = req.params as { id: string | undefined }

    if (!amount || amount < 0) {
        res.status(400).json({ message: 'Amount is required and must be greater than zero' })
        return
    }

    if (!description) {
        res.status(400).json({ message: 'Description is required' })
        return
    }

    if (!bankAccountId || !categoryId) {
        res.status(400).json({ message: 'Bank and category are required' })
        return
    }

    // Verifica se categoria existe
    if (!(await new CategoryService().findById(categoryId))) {
        res.status(400).json({ message: 'Category not found' })
        return
    }

    // Verifica se banco existe
    const bankAcc = await bankAccount.findByGuid(bankAccountId)
    if (!bankAcc) {
        res.status(400).json({ message: 'Bank account not found' })
        return
    }

    if (id) {
        if (await new TransactionService().findByGuid(id)) {
            res.status(400).json({ message: 'Transaction not found' })
            return
        }
    }

    try {
        const transaction = await new TransactionService().upsert({
            amount,
            bankAccountId: bankAcc.id,
            categoryId,
            date: date || new Date(),
            description,
            userId: req.user.id,
        })

        res.status(200).json(transaction)
        return
    } catch (e) {
        res.status(500).json({ message: (e as Error).message })
        return
    }
}
