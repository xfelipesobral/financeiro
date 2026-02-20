import { addDays } from '../../../utils/addDays'
import { ApiError } from '../../../utils/error'
import { createAccessToken } from '../../../utils/token'
import { user } from '../../user/service'
import { SessionRepository } from '../repository'

export class SessionService extends SessionRepository {
    private daysLimitSession = 30

    generateExpiresAt() {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + this.daysLimitSession)
        return expiresAt
    }

    async validate(guid: string): Promise<boolean> {
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
        const session = await super.findByRefreshToken(refreshToken)

        if (!session || session.revokedAt || session.origin !== origin || session.userAgent !== userAgent || session.expiresAt < new Date()) {
            if (session && !session.revokedAt) {
                await super.revokeById(session.id) // Revoga a sessao
            }

            throw new ApiError('INVALID_REFRESH_TOKEN', 'The provided refresh token is invalid or has expired.')
        }

        const sessionUser = await user.findById(session.userId)

        if (!sessionUser) {
            await super.revokeById(session.id) // Revoga a sessao
            throw new ApiError('USER_NOT_FOUND', 'The user associated with this session was not found.')
        }

        // Renova o access token
        const { token } = createAccessToken({
            options: {
                subject: sessionUser.guid,
                expiresIn: '1h',
                jwtid: session.guid,
            },
        })

        return token
    }
}

export const session = new SessionService()
