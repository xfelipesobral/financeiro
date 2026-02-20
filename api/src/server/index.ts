import Fastify from 'fastify'

import router from '../routes'
import { reorgDatabase } from '../db/migrations'

export async function startServer(porta: number = 3300) {
    await reorgDatabase()

    const app = Fastify({
        bodyLimit: 100 * 1024 * 1024, // 100mb
    })

    await app.register(router)

    await app.listen({ port: porta, host: '0.0.0.0' }).then(() => {
        console.log('#######################################################')
        console.log('API FINANCEIRO 🟢')
        console.log(`PORTA: ${porta}`)
        console.log('#######################################################')
    })

    return app
}
