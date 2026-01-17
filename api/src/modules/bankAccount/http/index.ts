import { Router } from 'express'

import { find } from './find'
import { newBankAccount } from './new'

const bankAccountRoutes = Router()

bankAccountRoutes.get('/', find)
bankAccountRoutes.get('/:id', find)
bankAccountRoutes.post('/', newBankAccount)

export { bankAccountRoutes }
