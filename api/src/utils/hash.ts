import bcrypt from 'bcrypt'
import crypto from 'crypto'

export function generateHash(text: string): Promise<string> {
    return bcrypt.hash(text, 12)
}

export function generateHashSha256(text: string, hashPassword = process.env.SHA256_PASSWORD || ''): string {
    return crypto.createHmac('sha256', hashPassword).update(text).digest('hex')
}

export async function validateHash(text: string, hash: string): Promise<boolean> {
    if (!text || !hash) return false
    return bcrypt.compare(text, hash)
}

// Hash (não reversível, sem custo artificial) usado só pra não guardar o refresh token em texto
// puro no banco, diferente da senha, o token já nasce com entropia alta, então não precisa de
// bcrypt; o objetivo aqui é só resistir a um vazamento do banco, não a força bruta sobre o valor.
export function hashToken(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex')
}
