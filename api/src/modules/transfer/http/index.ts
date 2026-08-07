import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { get } from './get'
import { remove } from './remove'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function transferRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.post('/', create)
        instancia.get('/', list)
        instancia.get('/:transferId', get)
        instancia.delete('/:transferId', remove)
    })
}
