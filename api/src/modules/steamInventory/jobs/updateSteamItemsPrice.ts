import { getCs2PriceByMarketUrl } from '../integrations/steam/functions/getCs2PriceByMarketUrl'
import { steamInventoryItemPriceHistory } from '../itemPriceHistory/service'

let isRunning = false

export async function updateSteamItemsPrice() {
    if (isRunning) {
        console.log('A atualização de preços já está em execução. Pulando esta execução...')
        return
    }

    isRunning = true

    try {
        const marketUrls = await steamInventoryItemPriceHistory.getAllLastRecorded()
        const totalItens = marketUrls.length

        const today = new Date().toDateString()
        let updatedCount = 0
        let getPriceSuccessCount = 0

        console.log(`Iniciando atualização de preços dos itens da steam. Total de itens: ${totalItens}`)
        for (const {
            marketUrl,
            _max: { recordedAt },
        } of marketUrls) {
            updatedCount++

            if (!marketUrl) {
                console.log(`Item sem marketUrl. Pulando... (${updatedCount}/${totalItens})`)
                continue
            }

            if (recordedAt && recordedAt.toDateString() === today) {
                console.log(`Item ${marketUrl} já atualizado hoje. Pulando... (${updatedCount}/${totalItens})`)
                continue
            }

            console.log(
                `Atualizando preço do item: ${marketUrl} - Última atualização: ${recordedAt ? recordedAt.toJSON() : 'Nunca atualizado'} (${updatedCount}/${totalItens})`,
            )

            try {
                const lastPriceSteam = (await getCs2PriceByMarketUrl(marketUrl)).price

                await steamInventoryItemPriceHistory.create(marketUrl, lastPriceSteam, 0)
                console.log(`Preço atualizado para ${marketUrl}: ${lastPriceSteam.toFixed(2)}`)
                getPriceSuccessCount++
            } catch (error) {
                console.error(`Erro ao atualizar preço do item: ${marketUrl}`)
            }
        }

        console.log(`Atualização de preços concluída. Total de itens atualizados: ${getPriceSuccessCount}/${totalItens}`)
    } catch (error) {
        console.error('Erro durante a atualização de preços dos itens da steam:', error)
    } finally {
        isRunning = false
    }
}
