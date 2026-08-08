import { session } from '../../session/service'
import { createAccessToken } from '../../../utils/token'
import { UserRepository } from '../repository'
import { ApiError } from '../../../utils/error'
import { validateHash } from '../../../utils/hash'

export class UserService extends UserRepository {
    async authenticate(
        email: string,
        password: string,
        origin?: string,
        userAgent?: string,
        ipAddress?: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        if (!password || !email) {
            throw new ApiError('REQUIRED_FIELDS_MISSING', 'Email e senha são obrigatórios', 400)
        }

        const user = await super.findByEmail(email)

        if (user && (await validateHash(password, user.password))) {
            let ipAddressHash = ipAddress
            // if (ipAddress) { // Ainda nao para teste
            //     ipAddressHash = generateHashSha256(ipAddress)
            // }

            const { session: sessionCreated, refreshToken } = await session.createSession(user.id, origin, userAgent, ipAddressHash)

            const { token } = createAccessToken({
                options: {
                    subject: user.id.toString(),
                    expiresIn: '1h',
                    jwtid: sessionCreated.guid,
                },
            })

            return {
                accessToken: token,
                refreshToken,
            }
        }

        throw new ApiError('INVALID_CREDENTIALS', 'Email ou senha inválidos', 401)
    }
}

export const user = new UserService()
