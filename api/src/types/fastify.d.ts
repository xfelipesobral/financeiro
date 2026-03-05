import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        authenticated?: {
            userId: number
            tokenId: number
        }
    }
}
