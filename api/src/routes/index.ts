import { FastifyInstance } from 'fastify'

import { userRoutes } from '../modules/user/http'
import { categoryRoutes } from '../modules/category/http'
import { steamItemRoutes } from '../modules/steamInventory/item/http'
import { steamItemTransactionRoutes } from '../modules/steamInventory/itemTransaction/http'

export default async function router(app: FastifyInstance) {
    app.get('/', async () => {
        return {
            mensagem: 'API Financeiro ONLINE 🟢',
        }
    })

    await app.register(userRoutes, { prefix: '/user' })
    await app.register(categoryRoutes, { prefix: '/category' })
    await app.register(steamItemRoutes, { prefix: '/steam/itens' })
    await app.register(steamItemTransactionRoutes, { prefix: '/steam/transactions' })
}
