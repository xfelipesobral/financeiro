import { v4 as uuid } from 'uuid'

import { validatePasswordHash } from '../../../utils/password'

import { SessionService } from '../../session/service'

import { UserModel } from './prisma'
import { createAccessToken } from '../../../utils/token'

export class UserService extends UserModel {

    async authenticate(email: string, password: string, identifier?: string): Promise<{ accessToken: string, refreshToken: string }> {
        if (!password || !email) {
            throw new Error('Email and password are required')
        }

        const user = await super.findByEmail(email)

        if (user && await validatePasswordHash(password, user.password)) {
            const { id, token } = createAccessToken({
                options: {
                    subject: user.id,
                    expiresIn: '1h'
                }
            })

            const refreshToken = await new SessionService().create(user.id, id, identifier)

            return {
                accessToken: token,
                refreshToken
            } 
        }

        throw new Error('Invalid email or password')
    }
}

export const user = new UserService()