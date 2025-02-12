import { Request, Response } from 'express'

import { BankService } from '../service'

interface Filters {
    id?: string
}

export async function find(req: Request, res: Response) {
    const { id } = req.params as { id: string | undefined }
    const querys = req.query as Filters

    const finalId = id || querys.id

    try {
        if (finalId) {
            const bank = await new BankService().findById(Number(finalId))

            if (!bank) {
                res.status(404).json({ message: 'Bank not found' })
                return
            }

            res.status(200).json(bank)
            return
        }

        const banks = await new BankService().find()

        res.status(200).json(banks)
        return
    } catch (e) {
        res.status(500).json({ message: (e as Error).message })
        return
    }
}
