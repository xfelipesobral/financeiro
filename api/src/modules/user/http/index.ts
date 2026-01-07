import { Router } from 'express'

import { authenticate } from './authenticate' 
import { renew } from './renew'
 
const userRoutes = Router()

userRoutes.post('/login', authenticate) // Rota de autenticacao
userRoutes.patch('/login', renew) // Rota de renovacao de token de autenticacao

export { userRoutes }