import got from 'got'
import Bottleneck from 'bottleneck'

const limiter = new Bottleneck({
    reservoir: 10, // número máximo de requisições que podem ser feitas
    reservoirRefreshAmount: 10, // número de requisições a serem adicionadas ao reservoir a cada refresh
    reservoirRefreshInterval: 60000, // intervalo de refresh em milissegundos (1 minuto)
    maxConcurrent: 1, // número máximo de requisições concorrentes
})

export const getCs2PriceByMarketUrl = limiter.wrap(async (marketUrl: string) => {
    const response = await got
        .get(`https://steamcommunity.com/market/priceoverview/?appid=730&country=BR&currency=7&market_hash_name=${encodeURIComponent(marketUrl)}`, {
            retry: { limit: 3, statusCodes: [429, 503] },
        })
        .json<{
            success: boolean
            lowest_price: string
            volume: string
            median_price: string
        }>()

    if (!response?.success) {
        throw new Error('Failed to fetch price from Steam Market')
    }

    return {
        ...response,
        price: parseFloat(
            (response.lowest_price || response.median_price)
                .replace(/[^0-9.,]+/g, '')
                .replace(/[.]/g, '')
                .replace(',', '.'),
        ),
    }
})
