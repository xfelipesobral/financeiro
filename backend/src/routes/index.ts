import { Router, Request, Response } from 'express'

import { authenticated } from '../middlewares/authenticated'

import { userRoutes } from './user.routes'
import { transactionRoutes } from './transaction.routes'
import { bankRoutes } from './banks.routes'
import { categoryRoutes } from './categories.routes'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World 🌍!'
    })
})

router.use('/user', userRoutes)
router.use('/transaction', authenticated, transactionRoutes)
router.use('/bank', authenticated, bankRoutes)
router.use('/category', authenticated, categoryRoutes)

export default router