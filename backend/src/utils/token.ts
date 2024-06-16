import { SignOptions, sign, verify } from 'jsonwebtoken'
import { v4 } from 'uuid'

interface Params {
    payload?: object
    options?: SignOptions
}

const secret = process.env.SECRET || 'segredo-muito-secreto'

export function createAccessToken({ options, payload }: Params): { id: string, token: string } {
    const id = v4()

    const token = sign(payload || {}, secret, {
        ...options,
        issuer: 'financeiro.felipesobral.com.br',
        jwtid: id
    })

    return { id, token }
}

export function verifyAcessToken(token: string) {
    return verify(token, secret)
}