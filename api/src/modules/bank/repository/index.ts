import { Bank } from '../../../../prisma/generated/client'
import { prisma } from '../../db'

export class BankRepository {
    private prisma = prisma.bank

    findById(id: number): Promise<Bank | null> {
        return this.prisma.findUnique({
            where: {
                id,
            },
        })
    }

    find(): Promise<Bank[]> {
        return this.prisma.findMany()
    }
}
