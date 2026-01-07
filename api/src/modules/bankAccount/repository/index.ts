import { BankAccount } from '../../../../prisma/generated/client'
import { prisma } from '../../db'

export class BankAccountRepository {
    private prisma = prisma.bankAccount

    findAll(): Promise<BankAccount[]> {
        return this.prisma.findMany({
            include: {
                bank: true,
            },
        })
    }

    findById(id: number): Promise<BankAccount | null> {
        return this.prisma.findUnique({
            where: {
                id,
            },
            include: {
                bank: true,
            },
        })
    }

    findByGuid(guid: string): Promise<BankAccount | null> {
        return this.prisma.findFirst({
            where: {
                guid,
            },
        })
    }

    create(userId: number, bankId: number, accountNumber: string = '', branchCode: string = '', description = '', pixKeys: string[] = []) {
        return this.prisma.create({
            data: {
                bankId,
                description,
                userId,
                accountNumber,
                branchCode,
                pixKeys,
            },
        })
    }
}
