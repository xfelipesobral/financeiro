import { Request, Response } from 'express'

import { bankAccount } from '../service'
import { bank } from '../../bank/service'

export async function newBankAccount(req: Request, res: Response) {
    const { bankId, description } = req.params as { bankId?: number; description?: string }

    if (!bankId) {
        return res.send(400).json({ message: 'Bank is missing' })
    }

    // Buscar se existe banco
    const bankSelected = await bank.findById(bankId)

    if (!bankSelected) {
        return res.status(404).json({ message: 'Bank not found' })
    }

    // Tenta criar uma nova conta bancaria
    const newBank = await bankAccount.create(req.user.id, bankSelected.id, description || bankSelected.name)

    // Se a conta foi criada com sucesso
    if (newBank.bankId) {
        return res.status(201).json(newBank) // Retorna a conta criada
    }

    return res.status(400).json({ message: 'Error to create bank account' })
}
