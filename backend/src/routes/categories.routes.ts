import { Router } from 'express'

import { find } from '../modules/category/http/find'

const categoryRoutes = Router()

categoryRoutes.get('/', find)
categoryRoutes.get('/:id', find)

export { categoryRoutes }