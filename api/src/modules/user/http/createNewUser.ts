import { ApiError, handleApiError } from '../../../utils/error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { user } from '../service'
import { uuid } from '../../../utils/uuid'
import { generateHash } from '../../../utils/hash'

export async function createNewUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, firstName, lastName, password } = request.body as { email?: string; firstName?: string; lastName?: string; password?: string }

    if (!email || !firstName || !lastName || !password) {
        throw new ApiError('REQUIRED_FIELDS_MISSING', 'All fields are required.', 400)
    }

    try {
        const guid = uuid()
        const passwordHash = await generateHash(password)

        const userCreated = await user.create(guid, email, firstName, lastName, passwordHash)

        reply.status(200).send({ id: userCreated.id, guid: userCreated.guid })
        return
    } catch (error) {
        handleApiError(error, reply)
    }
}
