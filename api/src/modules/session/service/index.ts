import { addDays } from '../../../utils/addDays'
import { createAccessToken } from '../../../utils/token'
import { user } from '../../user/service'
import { SessionRepository } from '../repository'

export class SessionService extends SessionRepository {
    private daysLimitSession = 30

    async validate(refreshToken: string): Promise<boolean> {
        const session = await super.findByRefreshToken(refreshToken)

        if (!session) {
            return false
        }

        const limit = addDays(session.createdAt, this.daysLimitSession)

        // Checa se a sessao expirou
        if (limit > new Date()) {
            return true // Sessao valida
        }

        // Caso tenha expirado...
        await super.delete(refreshToken) // Deleta sessao
        return false
    }

    async renew(refreshToken: string, identifier: string): Promise<string> {
        const session = await super.findByRefreshToken(refreshToken)

        if (!session) {
            throw new Error('Invalid refresh token')
        }

        const sessionUser = await user.findById(session.userId)
        if (!sessionUser) {
            throw new Error('User not found')
        }

        // Calcula o limite maximo de vida da sessao
        const limit = addDays(session.createdAt, this.daysLimitSession)

        // Verifica se a sessao ja expirou ou se o identificador nao bate com quem gerou
        if (limit < new Date() || session.identifier !== identifier) {
            await super.delete(refreshToken) // Delete the session
            throw new Error('Refresh token expired')
        }

        // Cria accessToken
        const { id, token } = createAccessToken({
            options: {
                subject: sessionUser.guid,
                expiresIn: '1h',
            },
        })

        // Atualiza a sessao com o novo token
        await super.update({
            id: session.id,
            content: session.content,
            tokenId: id,
        })

        return token
    }
}

export const session = new SessionService()
