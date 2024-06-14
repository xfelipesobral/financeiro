import { Router, Request, Response } from 'express'

import { userRoutes } from './user.routes'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World 🌍!'
    })
})

router.use('/user', userRoutes)

export default router