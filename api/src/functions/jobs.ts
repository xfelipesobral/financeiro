import cron from 'node-cron'
import { updateSteamItemsPrice } from '../modules/steamInventory/jobs/updateSteamItemsPrice'

export function initJobs() {
    // Agendar a tarefa para rodar diariamente às 7h da manhã e 18h da tarde, no horário de São Paulo
    cron.schedule(
        '0 7,18 * * *',
        async () => {
            await updateSteamItemsPrice()
        },
        {
            timezone: 'America/Sao_Paulo',
        },
    )
}
