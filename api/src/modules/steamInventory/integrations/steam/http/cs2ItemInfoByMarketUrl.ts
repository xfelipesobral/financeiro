import { FastifyReply, FastifyRequest } from 'fastify'
import { ApiError, handleApiError } from '../../../../../utils/error'
import { getCs2ItemInfoByMarketUrl } from '../functions/getCs2ItemInfoByMarketUrl'

export async function cs2ItemInfoByMarketUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { marketUrl } = request.body as { marketUrl?: string }

        if (!marketUrl) {
            throw new ApiError('MARKET_URL_REQUIRED', 'URL de mercado é obrigatória', 400)
        }

        const price = await getCs2ItemInfoByMarketUrl(marketUrl)

        reply.status(200).send(price)
    } catch (error) {
        handleApiError(error, reply)
    }
}
