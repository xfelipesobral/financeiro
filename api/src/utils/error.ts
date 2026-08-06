import { FastifyReply } from 'fastify'

export class ApiError extends Error {
    public code: string
    public responseStatus: number

    constructor(code: string, message: string, responseStatus: number = 500) {
        super(message)
        this.code = code
        this.responseStatus = responseStatus

        Object.setPrototypeOf(this, new.target.prototype)
    }
}

export function handleApiError(error: unknown, reply: FastifyReply) {
    if (error instanceof ApiError) {
        reply.status(error.responseStatus).send({
            error: {
                code: error.code,
                message: error.message,
            },
        })
        return
    }

    console.error(error)

    reply.status(500).send({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Erro interno do servidor. Tente novamente mais tarde.',
        },
    })
}
