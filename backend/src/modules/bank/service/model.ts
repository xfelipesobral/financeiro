import { Bank } from '@prisma/client'

export interface BankFunctionsModel {
    findById(id: number): Promise<Bank | null>
}

export interface BankFunctionsService {
}