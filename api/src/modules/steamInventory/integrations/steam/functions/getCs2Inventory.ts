import got from 'got'

export async function getCs2Inventory(steamId: string) {
    if (!steamId) {
        throw new Error('Steam ID is required')
    }

    try {
        const inventory = await got
            .get(`https://steamcommunity.com/inventory/${steamId}/730/2?l=brazilian&count=1000`, {
                timeout: { request: 5000 },
                retry: { limit: 2 },
            })
            .json<IntegrationSteamInventoryResponse>()

        if (!inventory || !inventory.assets || !inventory.descriptions) {
            throw new Error('Invalid inventory response')
        }

        return inventory
    } catch (error) {
        throw new Error('Failed to fetch inventory')
    }
}
