import { Request, Response } from 'express'
import { CategoryType } from '@prisma/client'

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

            if (!category) return res.status(204).json({ message: 'Category not found' })

            return res.status(200).json(category)
        }

        if (querys.type) {
            const categories = await new CategoryService().findByType(querys.type as CategoryType)

            return res.status(200).json(categories)
        }

        const categories = await new CategoryService().find()

        return res.status(200).json(categories)
    } catch (e) {
        return res.status(500).json({ message: (e as Error).message })
    }
}