import { FastifyInstance } from 'fastify'
import { middlewareAuthenticated } from '../../../../middlewares/authenticated'
import { getItemTransactions } from './getItemTransactions'
import { httpSaveTransaction } from './saveTransaction'
import { httpDeleteTransaction } from './deleteTransaction'

export async function steamItemTransactionRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.get('/:itemId', getItemTransactions)
        instancia.post('/:itemId', httpSaveTransaction)
        instancia.delete('/:transactionId', httpDeleteTransaction)
    })
}
