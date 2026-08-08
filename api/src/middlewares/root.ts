import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../utils/error'
import { requireEnv } from '../utils/env'

const expectedApiRootKey = requireEnv('ADMIN_SECRET')

// Comparação em tempo constante: `!==` sai mais cedo no primeiro caractere diferente, o que em
// teoria vaza por timing quantos caracteres da chave o requisitante já acertou. Percorre sempre o
// comprimento todo em vez de usar crypto.timingSafeEqual pra não depender de Buffer aqui.
function safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false

    let mismatch = 0

    for (let i = 0; i < a.length; i++) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }

    return mismatch === 0
}

export async function middlewareRoot(request: FastifyRequest, reply: FastifyReply) {
    try {
        const apiRootKey = request.headers['x-api-key'] as string | undefined

        if (!apiRootKey || !safeCompare(apiRootKey, expectedApiRootKey)) {
            throw new ApiError('INVALID_API_ROOT_KEY', 'Chave de administrador ausente ou inválida', 400)
        }
    } catch (e) {
        handleApiError(e, reply)
        return
    }
}
