import { Category, CategoryType } from '@prisma/client'

export interface CategoryFunctionsModel {
    findById(id: number): Promise<Category | null>
    findByType(type: CategoryType): Promise<Category[]>
}

export interface CategoryFunctionsService {
}