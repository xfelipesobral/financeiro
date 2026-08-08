import { ApiError } from '../../../utils/error'
import { createAccessToken, generateRefreshToken } from '../../../utils/token'
import { hashToken } from '../../../utils/hash'
import { user } from '../../user/service'
import { SessionRepository } from '../repository'

export class SessionService extends SessionRepository {
    private daysLimitSession = 30

    generateExpiresAt() {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + this.daysLimitSession)
        return expiresAt
    }

    // Gera o refresh token e devolve o valor em texto puro (pra mandar pro cliente) — só o hash dele
    // é persistido (ver hashToken em utils/hash). Substitui o antigo `session.create(userId, uuid(), ...)`
    // chamado direto em UserService.authenticate.
    async createSession(userId: number, origin?: string, userAgent?: string, ipAddress?: string) {
        const refreshToken = generateRefreshToken()

        const sessionCreated = await super.create(userId, hashToken(refreshToken), this.generateExpiresAt(), origin, userAgent, ipAddress)

        return { session: sessionCreated, refreshToken }
    }

    findByRawRefreshToken(refreshToken: string) {
        return super.findByRefreshToken(hashToken(refreshToken))
    }

    revokeByRawRefreshToken(refreshToken: string) {
        return super.revokeByRefreshToken(hashToken(refreshToken))
    }

    async validate(guid: string) {
        const session = await super.findByGuid(guid)

        if (!session || session.revokedAt) {
            return false
        }

        // Checa se a sessao expirou
        if (session.expiresAt > new Date()) {
            return true // Sessao valida
        }

        await super.revokeById(session.id) // Revoga o refresh token
        return false
    }

    async renew(refreshToken: string, origin: string, userAgent: string) {
        const session = await this.findByRawRefreshToken(refreshToken)

        if (!session || session.revokedAt || session.origin !== origin || session.userAgent !== userAgent || session.expiresAt < new Date()) {
            if (session && !session.revokedAt) {
                await super.revokeById(session.id) // Revoga a sessao
            }

            throw new ApiError('INVALID_REFRESH_TOKEN', 'Refresh token inválido ou expirado')
        }

        const sessionUser = await user.findById(session.userId)

        if (!sessionUser) {
            await super.revokeById(session.id) // Revoga a sessao
            throw new ApiError('USER_NOT_FOUND', 'Usuário não encontrado')
        }

        const { token } = createAccessToken({
            options: {
                subject: sessionUser.id.toString(),
                expiresIn: '1h',
                jwtid: session.guid,
            },
        })

        return token
    }
}

export const session = new SessionService()
