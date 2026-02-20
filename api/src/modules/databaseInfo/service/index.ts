import Repository from '../repository'

export class DatabaseInfoService extends Repository {
    async lastVersion() {
        try {
            const lastVersion = await this.find()
            return lastVersion?.version || 0
        } catch (error) {
            return 0
        }
    }
}

export const databaseInfo = new DatabaseInfoService()
