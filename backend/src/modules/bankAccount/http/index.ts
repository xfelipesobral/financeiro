import { Router } from 'express'

import { find } from './find'

const bankAccountRoutes = Router()

bankAccountRoutes.get('/', find)
bankAccountRoutes.get('/:id', find)

export { bankAccountRoutes }