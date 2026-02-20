import { Request, Response } from 'express'
import { CategoryType } from '../../../../prisma/generated/client'

import { category, CategoryService } from '../service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { handleApiError } from '../../../utils/error'

interface Filters {
    id?: string
    type?: string
}

export async function find(request: AuthenticatedRequest, reply: FastifyReply) {
    const userId = request.user!.id
    const { id } = request.params as { id?: string }
    const querys = request.query as Filters

    const finalId = id || querys.id

    try {
        if (finalId) {
            const categoryFinded = category.findById(Number(finalId))

            if (!category) {
                reply.status(204).send({ message: 'Category not found' })
                return
            }

            reply.status(200).send(category)
            return
        }

        if (querys.type) {
            const categories = await new CategoryService().findByType(querys.type as CategoryType)

            res.status(200).json(categories)
            return
        }

        const categories = await new CategoryService().find()

        res.status(200).json(categories)
        return
    } catch (e) {
        handleApiError(e, reply)
    }
}
