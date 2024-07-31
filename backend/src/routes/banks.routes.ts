import { Router } from 'express'

import { find } from '../modules/bank/http/find'

const bankRoutes = Router()

bankRoutes.get('/', find)
bankRoutes.get('/:id', find)

export { bankRoutes }