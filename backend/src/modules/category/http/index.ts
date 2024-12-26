import { Router } from 'express'

import { find } from './find'

const categoryRoutes = Router()

categoryRoutes.get('/', find)
categoryRoutes.get('/:id', find)

export { categoryRoutes }