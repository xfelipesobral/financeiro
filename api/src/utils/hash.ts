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
