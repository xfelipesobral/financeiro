import { FastifyInstance } from 'fastify'

import { userRoutes } from '../modules/user/http'
import { transactionRoutes } from '../modules/transaction/http'
import { bankRoutes } from '../modules/bank/http'
import { categoryRoutes } from '../modules/category/http'
import { bankAccountRoutes } from '../modules/bankAccount/http'

export default async function router(app: FastifyInstance) {
    app.get('/', async () => {
        return {
            mensagem: 'API Financeiro ONLINE 🟢',
        }
    })

    await app.register(userRoutes, { prefix: '/user' })
    // await app.register(transactionRoutes, { prefix: '/transaction' })
    // await app.register(bankRoutes, { prefix: '/bank' })
    // await app.register(categoryRoutes, { prefix: '/category' })
    // await app.register(bankAccountRoutes, { prefix: '/bank-account' })
}
