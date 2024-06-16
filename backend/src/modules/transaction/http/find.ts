import { Request, Response } from 'express'

import { TransactionService } from '../service'

export async function find(req: Request, res: Response) {
    const { id } = req.params as { id: string | undefined }

    if (!id) {
        return res.status(400).json({ message: 'Transaction ID is required' })
    }

    try {
        const transaction = await new TransactionService().findById(id)

        if (!transaction) return res.status(204).json({ message: 'Transaction not found' })

        return res.status(200).json(transaction)
    } catch (e) {
        return res.status(500).json({ message: (e as Error).message })
    }
}