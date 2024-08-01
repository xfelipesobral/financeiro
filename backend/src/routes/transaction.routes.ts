import { Router } from 'express'

import { upsert } from '../modules/transaction/http/upsert'
import { find } from '../modules/transaction/http/find'
import { total } from '../modules/transaction/http/total'

const transactionRoutes = Router()

transactionRoutes.post('/', upsert)
transactionRoutes.put('/patch/:id', upsert)
transactionRoutes.get('/total', total)
transactionRoutes.get('/:id', find)
transactionRoutes.get('/', find)

export { transactionRoutes }