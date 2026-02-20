import { prisma } from '../../../db'

export default class DatabaseInfoRepository {
    private databaseInfo = prisma.databaseInfo

    find() {
        return this.databaseInfo.findUnique({
            where: {
                id: 1,
            },
        })
    }

    updateVersion(version: number) {
        return this.databaseInfo.upsert({
            where: {
                id: 1,
            },
            update: {
                version,
            },
            create: {
                id: 1,
                version,
            },
        })
    }
}
