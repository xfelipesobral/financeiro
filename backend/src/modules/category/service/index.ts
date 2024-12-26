
import { CategoryModel } from './prisma'

export class CategoryService extends CategoryModel {
}

export const category = new CategoryService()