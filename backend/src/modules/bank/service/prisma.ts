import { Bank } from '@prisma/client'
import { prisma } from '../../db'

export class BankModel {
    private prisma = prisma.bank

    findById(id: number): Promise<Bank | null> {
        return this.prisma.findUnique({
            where: {
                id
            }
        })
    }

    find(): Promise<Bank[]> {
        return this.prisma.findMany()
    }
}