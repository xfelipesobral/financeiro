import { FastifyInstance } from 'fastify'
import { middlewareAuthenticated } from '../../../../middlewares/authenticated'
import { getItemTransactions } from './getItemTransactions'

export async function steamItemTransactionRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.get('/:itemId', getItemTransactions)
    })
}
