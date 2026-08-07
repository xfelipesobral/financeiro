import { ApiError } from '../../../utils/error'
import { CategoryType } from '../../../../prisma/generated/enums'
import { category } from '../service'

const CATEGORY_TYPES: CategoryType[] = ['DEBIT', 'CREDIT']

export async function createCategory(userId: number, data: CreateCategoryDTO = {}) {
    const description = data.description?.trim()

    if (!description) {
        throw new ApiError('CATEGORY_DESCRIPTION_REQUIRED', 'Descrição da categoria é obrigatória', 400)
    }

    if (!data.type || !CATEGORY_TYPES.includes(data.type)) {
        throw new ApiError('INVALID_CATEGORY_TYPE', 'Tipo de categoria inválido', 400)
    }

    let parentId: number | undefined

    if (data.parentId !== undefined && data.parentId !== null) {
        const parentIdNumber = Number(data.parentId)

        if (isNaN(parentIdNumber)) {
            throw new ApiError('INVALID_PARENT_CATEGORY_ID', 'Categoria pai inválida', 400)
        }

        const parentFinded = await category.findById(parentIdNumber, userId)

        if (!parentFinded) {
            throw new ApiError('PARENT_CATEGORY_NOT_FOUND', 'Categoria pai não encontrada', 404)
        }

        // Só pode usar como pai uma categoria que seja sua (nunca uma global/do sistema) e que ela
        // mesma seja uma categoria base (sem pai) — mantém a hierarquia em só 2 níveis.
        if (parentFinded.userId !== userId) {
            throw new ApiError('PARENT_CATEGORY_NOT_EDITABLE', 'A categoria pai precisa ser uma categoria sua', 400)
        }

        if (parentFinded.parentId) {
            throw new ApiError('PARENT_CATEGORY_HAS_PARENT', 'Só é possível usar uma categoria base (sem categoria pai) como categoria pai', 400)
        }

        parentId = parentIdNumber
    }

    return category.create(description, data.type, userId, parentId)
}

export interface CreateCategoryDTO {
    description?: string
    type?: CategoryType
    parentId?: number | null
}
