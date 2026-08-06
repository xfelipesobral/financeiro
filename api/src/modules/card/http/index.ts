import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { get } from './get'
import { update } from './update'
import { remove } from './remove'
import { middlewareAuthenticated } from '../../../middlewares/authenticated'

export async function cardRoutes(app: FastifyInstance) {
    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.post('/', create)
        instancia.get('/', list)
        instancia.get('/:cardId', get)
        instancia.patch('/:cardId', update)
        instancia.delete('/:cardId', remove)
    })
}
