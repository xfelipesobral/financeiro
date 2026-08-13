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

    create(
        userId: number,
        bankAccountId: number,
        categoryId: number,
        totalAmount: number,
        description: string,
        date: Date,
        installmentTotal: number | null = null,
    ) {
        return this.transaction.create({
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

    // Soma o totalAmount das transações de um tipo (DEBIT/CREDIT), agrupado por conta bancária, para
    // calcular saldo. Duas exclusões:
    // - Cartão de crédito (`payments.none.cardId != null`): o dinheiro só sai da conta bancária quando
    //   a fatura é paga, o que hoje não existe como transação própria — incluí-las contaria uma compra
    //   parcelada como se já tivesse saído da conta.
    // - PIX/débito agendado ainda não aceito (`payments.none` de um Payment PENDING sem cardId nem
    //   loanId — ver buildTransactionPayments/acceptScheduledPayment): só deve contar no saldo depois
    //   do aceite. `loanId: null` é necessário aqui pra não excluir o desembolso do empréstimo, que
    //   também nasce com Payments PENDING (um por parcela) mas deve contar no saldo imediatamente.
    sumTotalAmountByBankAccount(userId: number, type: CategoryType) {
        return this.transaction.groupBy({
            by: ['bankAccountId'],
            where: {
                userId,
                category: { type },
                payments: { none: { cardId: { not: null } } },
                NOT: { payments: { some: { status: 'PENDING', cardId: null, loanId: null } } },
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
