import { PrismaClient, Bank } from '@prisma/client'

import { BankFunctionsModel } from './model'

export class BankModel implements BankFunctionsModel {
    private prisma = new PrismaClient().bank

    findById(id: number): Promise<Bank | null> {
        return this.prisma.findUnique({
            where: {
                id
            }
        })
    } 
}