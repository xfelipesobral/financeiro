import { PrismaClient, Category, CategoryType } from '@prisma/client'

import { CategoryFunctionsModel } from './model'

export class CategoryModel implements CategoryFunctionsModel {
    private prisma = new PrismaClient().category

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
}