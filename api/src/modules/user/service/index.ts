import { validatePasswordHash } from '../../../utils/password'
import { SessionService } from '../../session/service'
import { createAccessToken } from '../../../utils/token'
import { UserRepository } from '../repository'
import { ApiError } from '../../../utils/error'

export class UserService extends UserRepository {
    async authenticate(email: string, password: string, identifier?: string): Promise<{ accessToken: string; refreshToken: string }> {
        if (!password || !email) {
            throw new ApiError('REQUIRED_FIELDS_MISSING', 'Email and password are required fields', 400)
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

        throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }
}

export const user = new UserService()
