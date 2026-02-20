import { SignOptions, sign, verify } from 'jsonwebtoken'
import { uuid } from './uuid'

interface Params {
    payload?: object
    options?: SignOptions
}

const secret = process.env.SECRET || 'segredo-muito-secreto'

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
