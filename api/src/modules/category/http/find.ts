import { Request, Response } from 'express'
import { CategoryType } from '../../../../prisma/generated/client'

import { CategoryService } from '../service'

interface Filters {
    id?: string
    type?: string
}

export async function find(req: Request, res: Response) {
    const { id } = req.params as { id: string | undefined }
    const querys = req.query as Filters

    const finalId = id || querys.id

    try {
        if (finalId) {
            const category = await new CategoryService().findById(Number(finalId))

            if (!category) {
                res.status(204).json({ message: 'Category not found' })
                return
            }

            res.status(200).json(category)
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
        res.status(500).json({ message: (e as Error).message })
        return
    }
}
