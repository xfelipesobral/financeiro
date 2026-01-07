import bcrypt from 'bcrypt'

export function passwordToHash(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export function validatePasswordHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)      
}