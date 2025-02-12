import { Router } from 'express'

import { find } from './find'

const bankRoutes = Router()

bankRoutes.get('/', find)
bankRoutes.get('/:id', find)

export { bankRoutes }
