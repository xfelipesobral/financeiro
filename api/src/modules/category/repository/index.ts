import { CategoryType } from '../../../../prisma/generated/enums'
import { prisma } from '../../../db'

export class CategoryRepository {
    private category = prisma.category

    findById(id: number, userId?: number) {
        return this.category.findUnique({
            where: {
                id,
                ...(userId ? { OR: [{ userId }, { userId: null }] } : { userId: null }),
            },
        })
    }

    findByType(type: CategoryType, userId?: number) {
        return this.category.findMany({
            where: {
                type,
                ...(userId ? { OR: [{ userId }, { userId: null }] } : { userId: null }),
            },
        })
    }

    find(userId: number) {
        return this.category.findMany({
            where: userId ? { OR: [{ userId }, { userId: null }] } : { userId: null }, // Se passou o userId, busca categorias do usuário ou categorias globais (userId null). Se não passou, busca apenas categorias globais.
        })
    }

    create(description: string, type: CategoryType, userId: number, parentCategoryId?: number | null) {
        return this.category.create({
            data: {
                description,
                type,
                userId,
                parentId: parentCategoryId,
            },
        })
    }

    updateById(id: number, description: string, type: CategoryType, parentCategoryId?: number | null) {
        return this.category.update({
            where: {
                id,
            },
            data: {
                description,
                type,
                parentId: parentCategoryId,
            },
        })
    }

    deleteById(id: number) {
        return this.category.delete({
            where: { id },
        })
    }

    // Quantas categorias têm esta como pai — usado pra bloquear exclusão/reparent de categoria que
    // ainda tem subcategorias.
    countByParentId(parentId: number) {
        return this.category.count({
            where: { parentId },
        })
    }

    // Soma de lançamentos (Transaction + SteamInventoryItemTransaction) que usam esta categoria —
    // usado pra bloquear exclusão de categoria já em uso.
    async countUsage(id: number) {
        const [transactions, steamTransactions] = await Promise.all([
            prisma.transaction.count({ where: { categoryId: id } }),
            prisma.steamInventoryItemTransaction.count({ where: { categoryId: id } }),
        ])

        return transactions + steamTransactions
    }
}
