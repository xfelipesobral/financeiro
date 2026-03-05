import { FastifyInstance } from 'fastify'
import { importCs2Inventory } from './importCs2Inventory'
import { middlewareAuthenticated } from '../../../../middlewares/authenticated'
import { middlewareRoot } from '../../../../middlewares/root'
import { cs2PriceByMarketUrl } from '../../integrations/steam/http/cs2PriceByMarketUrl'

export async function steamRoutes(app: FastifyInstance) {
    app.post('/cs2-item-price', { preHandler: [middlewareRoot] }, cs2PriceByMarketUrl)

    await app.register(async (instancia) => {
        instancia.addHook('preHandler', middlewareAuthenticated)

        instancia.post('/inventory-import', importCs2Inventory)
    })
}
