import got from 'got'
import Bottleneck from 'bottleneck'

const limiter = new Bottleneck({
    reservoir: 10, // número máximo de requisições que podem ser feitas
    reservoirRefreshAmount: 10, // número de requisições a serem adicionadas ao reservoir a cada refresh
    reservoirRefreshInterval: 60000, // intervalo de refresh em milissegundos (1 minuto)
    maxConcurrent: 1, // número máximo de requisições concorrentes
})

const MARKET_LISTING_URL_REGEX = /steamcommunity\.com\/market\/listings\/\d+\/([^/?#]+)/i
const TITLE_REGEX = /<title>([^<]*)<\/title>/i
const OG_IMAGE_REGEX = /property="og:image"\s+content="([^"]+)"/i

export interface Cs2ItemInfo {
    name: string
    marketName: string
    imageUrl: string
    marketUrl: string
}

export const getCs2ItemInfoByMarketUrl = limiter.wrap(async (marketUrl: string): Promise<Cs2ItemInfo> => {
    if (!marketUrl) {
        throw new Error('Market URL is required')
    }

    const urlMatch = marketUrl.match(MARKET_LISTING_URL_REGEX)

    if (!urlMatch) {
        throw new Error('Invalid Steam market listing URL')
    }

    let marketName: string
    try {
        marketName = decodeURIComponent(urlMatch[1])
    } catch {
        throw new Error('Invalid Steam market listing URL')
    }

    const html = await got
        .get(marketUrl, {
            timeout: { request: 10000 },
            retry: { limit: 3, statusCodes: [429, 503] },
        })
        .text()

    const titleMatch = html.match(TITLE_REGEX)
    const imageMatch = html.match(OG_IMAGE_REGEX)

    if (!titleMatch || !imageMatch) {
        throw new Error('Failed to extract item data from Steam Market page')
    }

    const name = titleMatch[1].replace(/\s*-\s*Steam Community Market\s*$/i, '').trim()
    const imageUrl = imageMatch[1]

    return {
        name,
        marketName,
        imageUrl,
        marketUrl,
    }
})
