import { prisma } from '..'
import { databaseInfo } from '../../modules/databaseInfo/service'

const lastVersion = 6

export async function reorgDatabase() {
    let querysList: string[] = []
    let dbVersion = await databaseInfo.lastVersion()

    console.log(`Verifying if database needs migrations... Current version: ${dbVersion}, Last version: ${lastVersion}`)
    if (dbVersion >= lastVersion) {
        return
    }

    if (dbVersion === 0) querysList = require('./v1.json')
    if (dbVersion === 1) querysList = require('./v2.json')
    if (dbVersion === 2) querysList = require('./v3.json')
    if (dbVersion === 3) querysList = require('./v4.json')
    if (dbVersion === 4) querysList = require('./v5.json')
    if (dbVersion === 5) querysList = require('./v6.json')

    dbVersion += 1

    console.log(`Executing migrations for version ${dbVersion}...`)

    for (const query of querysList) {
        try {
            await prisma.$executeRawUnsafe(query)
        } catch (e) {
            console.error(`Error executing query: ${query}`, e)
        }
    }

    try {
        await databaseInfo.updateVersion(dbVersion)
        console.log(`Migrations for database version ${dbVersion} completed successfully`)
    } catch (e) {
        console.error(`Error updating database version ${dbVersion - 1} to ${dbVersion}`, e)
    }

    await reorgDatabase() // Chama recursivamente para garantir que todas as migrações sejam aplicadas
}
