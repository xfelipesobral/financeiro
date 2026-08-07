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
        payments: { include: { card: true, loan: true }, orderBy: { installmentNumber: 'asc' as const } },
        transfer: {
            include: {
                fromBankAccount: { include: { bank: true } },
                toBankAccount: { include: { bank: true } },
            },
        },
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

    userFindById(userId: number, id: number, db: Prisma.TransactionClient = prisma) {
        return db.transaction.findFirst({
            where: { userId, id },
            include: TransactionRepository.includeDefault,
        })
    }

    countByBankAccountId(bankAccountId: number) {
        return this.transaction.count({
            where: { bankAccountId },
        })
    }

    create(
        userId: number,
        bankAccountId: number,
        categoryId: number,
        totalAmount: number,
        description: string,
        date: Date,
        installmentTotal: number | null = null,
        db: Prisma.TransactionClient = prisma,
    ) {
        return db.transaction.create({
            data: {
                guid: uuid(),
                userId,
                bankAccountId,
                categoryId,
                totalAmount,
                description,
                date,
                installmentTotal,
            },
            include: TransactionRepository.includeDefault,
        })
    }

    updateById(id: number, data: UpdateData, db: Prisma.TransactionClient = prisma) {
        return db.transaction.update({
            where: { id },
            data,
            include: TransactionRepository.includeDefault,
        })
    }

    deleteById(id: number, db: Prisma.TransactionClient = prisma) {
        return db.transaction.delete({
            where: { id },
        })
    }

    // Soma o totalAmount das transações de um tipo (DEBIT/CREDIT), agrupado por conta bancária, para
    // calcular saldo. Transações no cartão de crédito são excluídas (`payments.none.cardId != null`):
    // o dinheiro só sai da conta bancária quando a fatura é paga, o que hoje não existe como
    // transação própria — incluí-las contaria uma compra parcelada como se já tivesse saído da conta.
    sumTotalAmountByBankAccount(userId: number, type: CategoryType, db: Prisma.TransactionClient = prisma) {
        return db.transaction.groupBy({
            by: ['bankAccountId'],
            where: {
                userId,
                category: { type },
                payments: { none: { cardId: { not: null } } },
            },
            _sum: { totalAmount: true },
        })
    }
}

interface UpdateData {
    bankAccountId?: number
    categoryId?: number
    totalAmount?: number
    description?: string
    date?: Date
    installmentTotal?: number | null
    transferId?: number | null
}
