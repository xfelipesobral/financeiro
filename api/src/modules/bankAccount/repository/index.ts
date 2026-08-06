import { prisma } from '../../../db'
import { uuid } from '../../../utils/uuid'

export class BankAccountRepository {
    private bankAccount = prisma.bankAccount
    private bankAccountPix = prisma.bankAccountPix

    private static includeDefault = {
        bank: true,
        pixs: true,
    } as const

    userFindMany(userId: number) {
        return this.bankAccount.findMany({
            where: { userId },
            include: BankAccountRepository.includeDefault,
            orderBy: { createdAt: 'desc' },
        })
    }

    userFindById(userId: number, id: number) {
        return this.bankAccount.findFirst({
            where: { userId, id },
            include: BankAccountRepository.includeDefault,
        })
    }

    create(userId: number, bankId: number, branchCode: string, accountNumber: string, description?: string) {
        return this.bankAccount.create({
            data: {
                guid: uuid(),
                userId,
                bankId,
                branchCode,
                accountNumber,
                description,
            },
            include: BankAccountRepository.includeDefault,
        })
    }

    updateById(id: number, data: UpdateData) {
        return this.bankAccount.update({
            where: { id },
            data,
            include: BankAccountRepository.includeDefault,
        })
    }

    deleteById(id: number) {
        return this.bankAccount.delete({
            where: { id },
        })
    }

    createPixKeys(bankAccountId: number, pixKeys: PixKeyInput[]) {
        if (!pixKeys.length) return Promise.resolve()

        return this.bankAccountPix.createMany({
            data: pixKeys.map((pixKey) => ({
                bankAccountId,
                type: pixKey.type,
                value: pixKey.value,
            })),
        })
    }

    deletePixKeysByBankAccountId(bankAccountId: number) {
        return this.bankAccountPix.deleteMany({
            where: { bankAccountId },
        })
    }
}

interface UpdateData {
    bankId?: number
    branchCode?: string
    accountNumber?: string
    description?: string | null
}

export interface PixKeyInput {
    type: string
    value: string
}
