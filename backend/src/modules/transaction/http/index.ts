import { Router } from 'express'

import { upsert } from './upsert'
import { find } from './find'
import { total } from './total'

const transactionRoutes = Router()

transactionRoutes.post('/', upsert)
transactionRoutes.put('/patch/:id', upsert)
transactionRoutes.get('/total', total)
transactionRoutes.get('/:id', find)
transactionRoutes.get('/', find)

export { transactionRoutes }