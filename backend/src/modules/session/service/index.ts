
import { addDays } from '../../../utils/addDays'
import { createAccessToken } from '../../../utils/token'

import { SessionModel } from './prisma'

export class SessionService extends SessionModel {
    private daysLimitSession = 30

    async validate(refreshToken: string): Promise<boolean> {
        const session = await super.findById(refreshToken)

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
        const session = await super.findById(refreshToken)

        if (!session) {
            throw new Error('Invalid refresh token')
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
                subject: session.userId,
                expiresIn: '1h'
            }
        })

        // Atualiza a sessao com o novo token
        await super.update({
            id: session.id,
            content: session.content,
            tokenId: id
        })
        
        return token
    }
}

export const session = new SessionService()