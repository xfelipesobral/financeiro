
import { addDays } from '../../../utils/addDays'
import { createAccessToken } from '../../../utils/token'

import { SessionFunctionsService } from './model'
import { SessionModel } from './prisma'

export class SessionService extends SessionModel implements SessionFunctionsService {
    private daysLimitSession = 30

    async validateSession(refreshToken: string): Promise<boolean> {
        const session = await super.findSession(refreshToken)

        if (!session) {
            return false
        }   

        const limit = addDays(session.createdAt, this.daysLimitSession)

        // Check if the refresh token is expired
        if (limit > new Date()) {
            return true // Session is valid
        }

        await super.deleteSession(refreshToken) // Delete the session
        return false // Session is invalid
    }

    async renewAcessToken(refreshToken: string, identifier: string): Promise<string> {
        const session = await super.findSession(refreshToken)

        if (!session) {
            throw new Error('Invalid refresh token')
        }

        // Calculate the limit date for the refresh token
        const limit = addDays(session.createdAt, this.daysLimitSession)

        // Check if the refresh token is expired or if the session identifier is different
        if (limit < new Date() || session.identifier !== identifier) {
            await super.deleteSession(refreshToken) // Delete the session
            throw new Error('Refresh token expired')
        }

        // Create a new access token
        const { id, token } = createAccessToken({
            options: {
                subject: session.userId,
                expiresIn: '1h'
            }
        })

        // Update the session with the new access token
        await super.updateSession({
            id: session.id,
            content: session.content,
            tokenId: id
        })
        
        return token
    }
}