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

        // Pai pode ser sua ou do sistema (é pra isso que as categorias base curadas existem) — só
        // precisa ela mesma ser uma categoria base (sem pai), pra manter a hierarquia em só 2 níveis.
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
