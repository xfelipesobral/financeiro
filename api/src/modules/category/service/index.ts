import { CategoryRepository } from '../repository'

export class CategoryService extends CategoryRepository {}

export const category = new CategoryService()
