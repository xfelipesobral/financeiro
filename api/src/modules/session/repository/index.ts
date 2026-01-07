import { Session } from '../../../../prisma/generated/client'
import { prisma } from '../../db'

interface UpdateSessionParams {
    id: number
    content: string
    tokenId: string
}

export class SessionRepository {
    private prisma = prisma.session

    async update({ id, content, tokenId }: UpdateSessionParams): Promise<void> {
        await this.prisma.update({
            where: {
                id,
            },
            data: {
                content,
                tokenId,
            },
        })
    }

    async create(userId: number, tokenId: string, identifier: string = 'UNKNOW'): Promise<number> {
        const x = await this.prisma.create({
            data: {
                tokenId,
                userId,
                content: '',
                identifier,
            },
        })

        return x.id
    }

    async delete(refreshToken: string): Promise<void> {
        await this.prisma.deleteMany({
            where: {
                tokenId: refreshToken,
            },
        })
    }

    findById(id: number): Promise<Session | null> {
        return this.prisma.findUnique({
            where: {
                id,
            },
        })
    }

    findByRefreshToken(refreshToken: string): Promise<Session | null> {
        return this.prisma.findFirst({
            where: {
                tokenId: refreshToken,
            },
        })
    }
}
