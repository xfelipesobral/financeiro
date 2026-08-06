import { prisma, Prisma } from '../../../db'
import { uuid } from '../../../utils/uuid'

export interface CreateLoanData {
    userId: number
    bankAccountId: number
    description: string
    totalAmount: number
    installmentTotal: number
    dueDay: number
    interestRate: number | null
    startDate: Date
}

export interface UpdateLoanData {
    description?: string
    dueDay?: number
    interestRate?: number | null
}

export class LoanRepository {
    private loan = prisma.loan

    private static includeDefault = {
        bankAccount: { include: { bank: true } },
        payments: { orderBy: { installmentNumber: 'asc' as const } },
    } as const

    userFindMany(userId: number) {
        return this.loan.findMany({
            where: { userId },
            include: LoanRepository.includeDefault,
            orderBy: { createdAt: 'desc' },
        })
    }

    userFindById(userId: number, id: number) {
        return this.loan.findFirst({
            where: { id, userId },
            include: LoanRepository.includeDefault,
        })
    }

    create(data: CreateLoanData) {
        return this.loan.create({
            data: {
                guid: uuid(),
                ...data,
            },
            include: LoanRepository.includeDefault,
        })
    }

    updateById(id: number, data: UpdateLoanData) {
        return this.loan.update({
            where: { id },
            data,
            include: LoanRepository.includeDefault,
        })
    }

    deleteById(id: number) {
        return this.loan.delete({
            where: { id },
        })
    }
}
