import { SignOptions, sign } from 'jsonwebtoken'
import { v4 } from 'uuid'

interface Params {
    payload?: object
    options?: SignOptions
}

export function createAccessToken({ options, payload }: Params): { id: string, token: string } {
    const id = v4()

    const token = sign(payload || {}, process.env.SECRET || 'segredo-muito-secreto', {
        ...options,
        issuer: 'financeiro.felipesobral.com.br',
        jwtid: id
    })

    return { id, token }
}