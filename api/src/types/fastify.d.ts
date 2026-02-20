import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: number
        }
    }
}

type AuthenticatedRequest = FastifyRequest & {
    user: { id: number }
}
