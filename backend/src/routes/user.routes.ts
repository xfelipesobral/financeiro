import { Router } from 'express'

import { authenticate } from '../modules/user/http/authenticate' 
import { renew } from '../modules/user/http/renew'
 
const userRoutes = Router()

userRoutes.post('/login', authenticate)
userRoutes.patch('/login', renew)

export { userRoutes }