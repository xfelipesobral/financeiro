import { prisma, Prisma } from '../../../db'
import { CategoryType } from '../../../../prisma/generated/enums'
import { uuid } from '../../../utils/uuid'

export interface TransactionFilters {
    categoryId?: number
    type?: CategoryType
    startDate?: Date
    endDate?: Date
}

export interface Pagination {
    page: number
    pageSize: number
}

export class TransactionRepository {
    private transaction = prisma.transaction

    private static includeDefault = {
        category: true,
        bankAccount: { include: { bank: true } },
    } as const

    private buildWhere(userId: number, filters: TransactionFilters = {}): Prisma.TransactionWhereInput {
        return {
            userId,
            ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
            ...(filters.type ? { category: { type: filters.type } } : {}),
            ...(filters.startDate || filters.endDate
                ? {
                      date: {
                          ...(filters.startDate ? { gte: filters.startDate } : {}),
                          ...(filters.endDate ? { lte: filters.endDate } : {}),
                      },
                  }
                : {}),
        }
    }

    userFindMany(userId: number, filters: TransactionFilters = {}, pagination?: Pagination) {
        return this.transaction.findMany({
            where: this.buildWhere(userId, filters),
            include: TransactionRepository.includeDefault,
            orderBy: { date: 'desc' },
            ...(pagination ? { skip: (pagination.page - 1) * pagination.pageSize, take: pagination.pageSize } : {}),
        })
    }

    userCount(userId: number, filters: TransactionFilters = {}) {
        return this.transaction.count({
            where: this.buildWhere(userId, filters),
        })
    }

    userFindById(userId: number, id: number) {
        return this.transaction.findFirst({
            where: { userId, id },
            include: TransactionRepository.includeDefault,
        })
    }

    countByBankAccountId(bankAccountId: number) {
        return this.transaction.count({
            where: { bankAccountId },
        })
    }

    create(userId: number, bankAccountId: number, categoryId: number, totalAmount: number, description: string, date: Date) {
        return this.transaction.create({
            data: {
                guid: uuid(),
                userId,
                bankAccountId,
                categoryId,
                totalAmount,
                description,
                date,
            },
            include: TransactionRepository.includeDefault,
        })
    }

    updateById(id: number, data: UpdateData) {
        return this.transaction.update({
            where: { id },
            data,
            include: TransactionRepository.includeDefault,
        })
    }

    deleteById(id: number) {
        return this.transaction.delete({
            where: { id },
        })
    }
}

interface UpdateData {
    bankAccountId?: number
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: Date
}
