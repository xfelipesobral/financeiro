import { Request, Response } from 'express'
import { CategoryType } from '../../../../prisma/generated/client'

import { category, CategoryService } from '../service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../utils/error'

interface Filters {
    id?: string
    type?: string
}

export async function find(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!.id
    const { id } = request.params as { id?: string }
    const querys = request.query as Filters

    const finalId = id || querys.id

    try {
        if (finalId) {
            const categoryFinded = category.findById(Number(finalId), userId)

            if (!categoryFinded) {
                throw new ApiError('CATEGORY_NOT_FOUND', 'Category not found', 404)
            }

            reply.status(200).send(categoryFinded)
            return
        }

        if (querys.type) {
            const categories = await new CategoryService().findByType(querys.type as CategoryType, userId)

            reply.status(200).send(categories)
            return
        }

        const categories = await new CategoryService().find(userId)

        reply.status(200).send(categories)
        return
    } catch (e) {
        handleApiError(e, reply)
    }
}
