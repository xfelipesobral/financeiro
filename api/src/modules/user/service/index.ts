import { validatePasswordHash } from '../../../utils/password'
import { SessionService } from '../../session/service'
import { createAccessToken } from '../../../utils/token'
import { UserRepository } from '../repository'

export class UserService extends UserRepository {
    async authenticate(email: string, password: string, identifier?: string): Promise<{ accessToken: string; refreshToken: string }> {
        if (!password || !email) {
            throw new Error('Email and password are required')
        }

        const user = await super.findByEmail(email)

        if (user && (await validatePasswordHash(password, user.password))) {
            const { id, token } = createAccessToken({
                options: {
                    subject: user.guid,
                    expiresIn: '1h',
                },
            })

            await new SessionService().create(user.id, id, identifier)

            return {
                accessToken: token,
                refreshToken: id,
            }
        }

        throw new Error('Invalid email or password')
    }
}

export const user = new UserService()
