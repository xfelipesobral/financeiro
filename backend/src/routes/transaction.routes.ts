import { Router } from 'express'

import { upsert } from '../modules/transaction/http/upsert'
import { find } from '../modules/transaction/http/find'
 
const transactionRoutes = Router()

transactionRoutes.post('/', upsert)
transactionRoutes.put('/patch/:id', upsert)
transactionRoutes.get('/:id', find)

export { transactionRoutes }