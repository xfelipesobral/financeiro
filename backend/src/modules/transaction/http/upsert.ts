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
        return res.status(400).json({ message: 'Amount is required and must be greater than zero' })
    }

    if (!description) {
        return res.status(400).json({ message: 'Description is required' })
    }

    if (!bankAccountId || !categoryId) {
        return res.status(400).json({ message: 'Bank and category are required' })
    }

    // Verifica se categoria existe
    if (!await new CategoryService().findById(categoryId)) {
        return res.status(400).json({ message: 'Category not found' })
    }

    // Verifica se banco existe
    if (!await bankAccount.findById(bankAccountId)) {
        return res.status(400).json({ message: 'Bank account not found' })
    }

    if (id) {
        if (await new TransactionService().findById(id)) {
            return res.status(400).json({ message: 'Transaction not found' })
        }
    }

    try {
        const transaction = await new TransactionService().upsert({
            id,
            amount,
            bankAccountId,
            categoryId,
            date: date || new Date(),
            description,
            userId: req.user.id,
        })

        return res.status(200).json(transaction)
    } catch (e) {
        return res.status(500).json({ message: (e as Error).message })
    }
}