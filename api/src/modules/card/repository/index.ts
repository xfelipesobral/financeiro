import { prisma } from '../../../db'
import { CardType } from '../../../../prisma/generated/enums'
import { uuid } from '../../../utils/uuid'

export class CardRepository {
    private card = prisma.card

    private static includeDefault = {
        bankAccount: { include: { bank: true } },
    } as const

    userFindMany(userId: number) {
        return this.card.findMany({
            where: { bankAccount: { userId } },
            include: CardRepository.includeDefault,
            orderBy: { createdAt: 'desc' },
        })
    }

    userFindById(userId: number, id: number) {
        return this.card.findFirst({
            where: { id, bankAccount: { userId } },
            include: CardRepository.includeDefault,
        })
    }

    countByBankAccountId(bankAccountId: number) {
        return this.card.count({
            where: { bankAccountId },
        })
    }

    create(bankAccountId: number, name: string, closingDay: number, type: CardType, description: string, limit: number) {
        return this.card.create({
            data: {
                guid: uuid(),
                bankAccountId,
                name,
                closingDay,
                type,
                description,
                limit,
            },
            include: CardRepository.includeDefault,
        })
    }

    updateById(id: number, data: UpdateData) {
        return this.card.update({
            where: { id },
            data,
            include: CardRepository.includeDefault,
        })
    }

    deleteById(id: number) {
        return this.card.delete({
            where: { id },
        })
    }
}

interface UpdateData {
    name?: string
    closingDay?: number
    type?: CardType
    description?: string
    limit?: number
}
