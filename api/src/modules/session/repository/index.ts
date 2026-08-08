import { prisma } from '../../../db'
import { uuid } from '../../../utils/uuid'

export class SessionRepository {
    private session = prisma.session

    partialUpdate(id: number, properties: Partial<{ revokedAt: Date; expiresAt: Date }>) {
        return this.session.update({
            where: {
                id,
            },
            data: {
                ...properties,
            },
        })
    }

    create(userId: number, refreshTokenHash: string, expiresAt: Date, origin: string = '', userAgent: string = '', ipAddress?: string) {
        return this.session.create({
            data: {
                userId,
                guid: uuid(),
                refreshToken: refreshTokenHash,
                origin,
                userAgent,
                ipAddress,
                expiresAt,
            },
        })
    }

    revokeById(id: number) {
        return this.session.update({
            where: {
                id,
            },
            data: {
                revokedAt: new Date(),
            },
        })
    }

    revokeByRefreshToken(refreshTokenHash: string) {
        return this.session.updateMany({
            where: {
                refreshToken: refreshTokenHash,
            },
            data: {
                revokedAt: new Date(),
            },
        })
    }

    findById(id: number) {
        return this.session.findUnique({
            where: {
                id,
            },
        })
    }

    findByGuid(guid: string) {
        return this.session.findUnique({
            where: {
                guid,
            },
        })
    }

    findByRefreshToken(refreshTokenHash: string) {
        return this.session.findUnique({
            where: {
                refreshToken: refreshTokenHash,
            },
        })
    }
}
