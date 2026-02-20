import { generateHashSha256, validateHash } from '../../../utils/hash'
import { session } from '../../session/service'
import { createAccessToken } from '../../../utils/token'
import { UserRepository } from '../repository'
import { ApiError } from '../../../utils/error'
import { uuid } from '../../../utils/uuid'

export class UserService extends UserRepository {
    async authenticate(
        email: string,
        password: string,
        origin?: string,
        userAgent?: string,
        ipAddress?: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        if (!password || !email) {
            throw new ApiError('REQUIRED_FIELDS_MISSING', 'Email and password are required fields', 400)
        }

        const user = await super.findByEmail(email)

        if (user && (await validateHash(password, user.password))) {
            const { id, token } = createAccessToken({
                options: {
                    subject: user.guid,
                    expiresIn: '1h',
                },
            })

            let ipAddressHash = ipAddress
            // if (ipAddress) { // Ainda nao para teste
            //     ipAddressHash = generateHashSha256(ipAddress)
            // }

            await session.create(user.id, uuid(), session.generateExpiresAt(), origin, userAgent, ipAddressHash)

            return {
                accessToken: token,
                refreshToken: id,
            }
        }

        throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }
}

export const user = new UserService()
