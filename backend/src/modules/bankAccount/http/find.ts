import { Request, Response } from 'express'

import { bankAccount } from '../service'

interface Filters {
    id?: string
}

export async function find(req: Request, res: Response) {
    const { id } = req.params as { id: string | undefined }
    const querys = req.query as Filters

    const finalId = id || querys.id

    try {
        if (finalId) {
            const account = await bankAccount.findById(finalId)

            if (!account) return res.status(204).json({ message: 'Bank account not found' })

            return res.status(200).json(account)
        }

        const accounts = await bankAccount.findAll()

        return res.status(200).json(accounts)
    } catch (e) {
        return res.status(500).json({ message: (e as Error).message })
    }
}