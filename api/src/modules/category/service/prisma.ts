import { Category, CategoryType } from '@prisma/client'
import { prisma } from '../../db'

export class CategoryModel {
    private prisma = prisma.category

    findById(id: number): Promise<Category | null> {
        return this.prisma.findUnique({
            where: {
                id
            }
        })
    }

    findByType(type: CategoryType): Promise<Category[]> {
        return this.prisma.findMany({
            where: {
                type
            }
        })
    }

    find(): Promise<Category[]> {
        return this.prisma.findMany()
    }
}