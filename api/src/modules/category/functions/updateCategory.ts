import { ApiError } from '../../../utils/error'
import { CategoryType } from '../../../../prisma/generated/enums'
import { category } from '../service'

const CATEGORY_TYPES: CategoryType[] = ['DEBIT', 'CREDIT']

export async function updateCategory(userId: number, id: number, data: UpdateCategoryDTO = {}) {
    const existing = await category.findById(id, userId)

    if (!existing) {
        throw new ApiError('CATEGORY_NOT_FOUND', 'Categoria não encontrada', 404)
    }

    // Sem lista de ids protegidos: só edita quem é dono. Categoria global (userId null, seedada
    // pelo sistema) nunca passa nessa checagem, pra ninguém em nenhuma conta.
    if (existing.userId !== userId) {
        throw new ApiError('CATEGORY_NOT_EDITABLE', 'Esta categoria é gerenciada automaticamente pelo sistema e não pode ser editada', 400)
    }

    const description = data.description !== undefined ? data.description.trim() : existing.description

    if (!description) {
        throw new ApiError('CATEGORY_DESCRIPTION_REQUIRED', 'Descrição da categoria é obrigatória', 400)
    }

    const type = data.type !== undefined ? data.type : existing.type

    if (!CATEGORY_TYPES.includes(type)) {
        throw new ApiError('INVALID_CATEGORY_TYPE', 'Tipo de categoria inválido', 400)
    }

    let parentId: number | null = existing.parentId

    if (data.parentId !== undefined) {
        if (data.parentId === null) {
            parentId = null
        } else {
            const parentIdNumber = Number(data.parentId)

            if (isNaN(parentIdNumber)) {
                throw new ApiError('INVALID_PARENT_CATEGORY_ID', 'Categoria pai inválida', 400)
            }

            if (parentIdNumber === id) {
                throw new ApiError('CATEGORY_CANNOT_BE_OWN_PARENT', 'Uma categoria não pode ser pai dela mesma', 400)
            }

            const parentFinded = await category.findById(parentIdNumber, userId)

            if (!parentFinded) {
                throw new ApiError('PARENT_CATEGORY_NOT_FOUND', 'Categoria pai não encontrada', 404)
            }

            // Pai pode ser sua ou do sistema (é pra isso que as categorias base curadas existem) — só
            // precisa ela mesma ser uma categoria base (sem pai), pra manter a hierarquia em só 2 níveis.
            if (parentFinded.parentId) {
                throw new ApiError(
                    'PARENT_CATEGORY_HAS_PARENT',
                    'Só é possível usar uma categoria base (sem categoria pai) como categoria pai',
                    400,
                )
            }

            parentId = parentIdNumber
        }
    }

    // Virar subcategoria de outra enquanto ainda tem as próprias subcategorias quebraria a hierarquia
    // de 2 níveis.
    if (parentId !== null && parentId !== existing.parentId) {
        const childrenCount = await category.countByParentId(id)

        if (childrenCount > 0) {
            throw new ApiError('CATEGORY_HAS_CHILDREN', 'Esta categoria tem subcategorias e não pode virar uma subcategoria de outra', 400)
        }
    }

    return category.updateById(id, description, type, parentId)
}

export interface UpdateCategoryDTO {
    description?: string
    type?: CategoryType
    parentId?: number | null
}
