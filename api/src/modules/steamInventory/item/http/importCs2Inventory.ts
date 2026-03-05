import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../../utils/error'
import { getCs2Inventory } from '../../integrations/steam/functions/getCs2Inventory'
import { importCs2Inventory as importInventory } from '../functions/importCs2inventory'

export async function importCs2Inventory(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { steamId } = request.body as { steamId?: string }

        if (!steamId) {
            throw new ApiError('STEAM_ID_REQUIRED', 'Steam ID is required.', 400)
        }

        const inventory = await getCs2Inventory(steamId)

        await importInventory(request.authenticated!.userId, inventory)

        reply.status(200).send({
            message: 'Inventory imported successfully.',
        })

        return
    } catch (error) {
        handleApiError(error, reply)
    }
}
