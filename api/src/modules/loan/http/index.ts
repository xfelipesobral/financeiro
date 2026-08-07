import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { get } from './get'
import { update } from './update'
import { remove } from './remove'
import { settleInstallments } from './settleInstallments'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function loanRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.post('/', create)
        instancia.get('/', list)
        instancia.get('/:loanId', get)
        instancia.patch('/:loanId', update)
        instancia.patch('/:loanId/settle-installments', settleInstallments)
        instancia.delete('/:loanId', remove)
    })
}
