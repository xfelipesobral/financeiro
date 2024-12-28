import { Router } from 'express'

import { find } from './find'
import { bankAccountRoutes } from '../../bankAccount/http'

const bankRoutes = Router()

bankRoutes.get('/', find)
bankRoutes.get('/:id', find)
bankRoutes.use('/account', bankAccountRoutes)

export { bankRoutes }