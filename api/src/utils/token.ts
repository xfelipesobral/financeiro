import { randomBytes } from 'crypto'
import { SignOptions, sign, verify } from 'jsonwebtoken'
import { uuid } from './uuid'
import { requireEnv } from './env'

interface Params {
    payload?: object
    options?: SignOptions
}

const secret = requireEnv('SECRET')

// Cria um JWT novo
export function createAccessToken({ options, payload }: Params): { id: string; token: string } {
    const id = options?.jwtid || uuid()

    const token = sign(payload || {}, secret, {
        ...options,
        issuer: 'financeiro-api',
        jwtid: id,
    })

    return { id, token }
}

export function verifyAccessToken(token: string) {
    return verify(token, secret) // Verifica se e um jwt valido
}

// Refresh token: 384 bits de entropia (bem acima do que um uuid v7 daria, que embute timestamp e
// tem menos bits realmente aleatórios). Só o hash dele (ver hashToken em ./hash) é guardado no banco.
export function generateRefreshToken(): string {
    return randomBytes(48).toString('hex')
}
