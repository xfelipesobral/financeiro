import { Router, Request, Response } from 'express'

import { authenticated } from '../middlewares/authenticated'

import { userRoutes } from './user.routes'
import { transactionRoutes } from './transaction.routes'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World 🌍!'
    })
})

router.use('/user', userRoutes)
router.use('/transaction', authenticated, transactionRoutes)

export default router