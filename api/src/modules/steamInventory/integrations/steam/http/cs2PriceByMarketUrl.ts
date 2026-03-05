import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../../../utils/error'
import { getCs2Inventory } from '../functions/getCs2Inventory'
import { getCs2PriceByMarketUrl } from '../functions/getCs2PriceByMarketUrl'

export async function cs2PriceByMarketUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { marketUrl } = request.body as { marketUrl?: string }

        if (!marketUrl) {
            throw new ApiError('MARKET_URL_REQUIRED', 'Market URL is required.', 400)
        }

        const price = await getCs2PriceByMarketUrl(marketUrl)

        reply.status(200).send(price)
    } catch (error) {
        handleApiError(error, reply)
    }
}
