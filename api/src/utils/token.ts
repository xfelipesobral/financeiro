import { SignOptions, sign, verify } from 'jsonwebtoken'
import { v7 } from 'uuid'

interface Params {
    payload?: object
    options?: SignOptions
}

const secret = process.env.SECRET || 'segredo-muito-secreto'

// Cria um JWT novo
export function createAccessToken({ options, payload }: Params): { id: string; token: string } {
    const id = v7()

    const token = sign(payload || {}, secret, {
        ...options,
        issuer: 'financeiro.felipesobral.com.br',
        jwtid: id,
    })

    return { id, token }
}

export function verifyAcessToken(token: string) {
    return verify(token, secret) // Verifica se e um jwt valido
}
