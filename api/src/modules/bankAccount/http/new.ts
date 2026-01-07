import { Request, Response } from 'express'

import { bankAccount } from '../service'
import { bank } from '../../bank/service'

export async function newBankAccount(req: Request, res: Response) {
    const { bankId, description, accountNumber, branchCode, pixKeys } = req.params as {
        bankId?: number
        description?: string
        accountNumber?: string
        branchCode?: string
        pixKeys?: string[]
    }

    if (!bankId) {
        res.send(400).json({ message: 'Bank is missing' })
        return
    }

    // Buscar se existe banco
    const bankSelected = await bank.findById(bankId)

    if (!bankSelected) {
        res.status(404).json({ message: 'Bank not found' })
        return
    }

    // Tenta criar uma nova conta bancaria
    const newBank = await bankAccount.create(req.user.id, bankSelected.id, accountNumber, branchCode, description || bankSelected.name, pixKeys)

    // Se a conta foi criada com sucesso
    if (newBank.bankId) {
        res.status(201).json(newBank) // Retorna a conta criada
        return
    }

    res.status(400).json({ message: 'Error to create bank account' })
    return
}
