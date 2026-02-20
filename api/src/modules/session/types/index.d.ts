export interface SessionJwtPayload {
    iat: number
    exp: number
    iss: string
    sub: string
    jti: string
}
