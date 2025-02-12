import { Router, Request, Response } from 'express'

import { authenticated } from '../middlewares/authenticated'

import { userRoutes } from '../modules/user/http'
import { transactionRoutes } from '../modules/transaction/http'
import { bankRoutes } from '../modules/bank/http'
import { categoryRoutes } from '../modules/category/http'
import { bankAccountRoutes } from '../modules/bankAccount/http'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'API ON 🟢',
    })
})

router.use('/user', userRoutes)
router.use('/transaction', authenticated, transactionRoutes)
router.use('/bank', authenticated, bankRoutes)
router.use('/bankAccount', authenticated, bankAccountRoutes)
router.use('/category', authenticated, categoryRoutes)

export default router
