import { prisma, Prisma } from '../../../db'
import { uuid } from '../../../utils/uuid'

export class TransferRepository {
    private transfer = prisma.transfer

    private static includeDefault = {
        fromBankAccount: { include: { bank: true } },
        toBankAccount: { include: { bank: true } },
        transactions: { include: { category: true, payments: true } },
    } as const

    userFindMany(userId: number) {
        return this.transfer.findMany({
            where: { userId },
            include: TransferRepository.includeDefault,
            orderBy: { date: 'desc' },
        })
    }

    userFindById(userId: number, id: number, db: Prisma.TransactionClient = prisma) {
        return db.transfer.findFirst({
            where: { userId, id },
            include: TransferRepository.includeDefault,
        })
    }

    create(
        userId: number,
        fromBankAccountId: number,
        toBankAccountId: number,
        amount: number,
        description: string,
        date: Date,
        db: Prisma.TransactionClient = prisma,
    ) {
        return db.transfer.create({
            data: {
                guid: uuid(),
                userId,
                fromBankAccountId,
                toBankAccountId,
                amount,
                description,
                date,
            },
            include: TransferRepository.includeDefault,
        })
    }

    deleteById(id: number, db: Prisma.TransactionClient = prisma) {
        return db.transfer.delete({
            where: { id },
        })
    }
}
