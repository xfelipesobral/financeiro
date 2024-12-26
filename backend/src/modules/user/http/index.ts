import { Router } from 'express'

import { authenticate } from './authenticate' 
import { renew } from './renew'
 
const userRoutes = Router()

userRoutes.post('/login', authenticate)
userRoutes.patch('/login', renew)

export { userRoutes }