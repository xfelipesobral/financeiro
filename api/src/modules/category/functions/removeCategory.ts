import { ApiError } from '../../../utils/error'
import { category } from '../service'

export async function removeCategory(userId: number, id: number) {
    const existing = await category.findById(id, userId)

    if (!existing) {
        throw new ApiError('CATEGORY_NOT_FOUND', 'Categoria não encontrada', 404)
    }

    if (existing.userId !== userId) {
        throw new ApiError('CATEGORY_NOT_EDITABLE', 'Esta categoria é gerenciada automaticamente pelo sistema e não pode ser excluída', 400)
    }

    const childrenCount = await category.countByParentId(id)

    if (childrenCount > 0) {
        throw new ApiError('CATEGORY_HAS_CHILDREN', 'Exclua ou mova as subcategorias antes de excluir esta categoria', 400)
    }

    const usageCount = await category.countUsage(id)

    if (usageCount > 0) {
        throw new ApiError('CATEGORY_IN_USE', 'Esta categoria já foi usada em lançamentos e não pode ser excluída', 400)
    }

    await category.deleteById(id)
}
