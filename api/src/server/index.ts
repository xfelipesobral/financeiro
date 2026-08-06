import Fastify from 'fastify'

import router from '../routes'
import { reorgDatabase } from '../db/migrations'
import { initJobs } from '../functions/jobs'
import { handleApiError } from '../utils/error'

export async function startServer(porta: number = 3300) {
    await reorgDatabase()

    const app = Fastify({
        bodyLimit: 100 * 1024 * 1024, // 100mb
    })

    app.setNotFoundHandler((request, reply) => {
        reply.status(404).send({
            error: {
                code: 'ROUTE_NOT_FOUND',
                message: 'Rota não encontrada.',
            },
        })
    })

    app.setErrorHandler((error, request, reply) => {
        handleApiError(error, reply)
    })

    await app.register(router)

    await app.listen({ port: porta, host: '0.0.0.0' }).then(() => {
        console.log('#######################################################')
        console.log('API FINANCEIRO 🟢')
        console.log(`PORTA: ${porta}`)
        console.log('#######################################################')
    })

    initJobs()

    return app
}
