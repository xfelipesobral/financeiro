import { Session } from '@prisma/client'
import { prisma } from '../../db'
import { v4 as uuid } from 'uuid'

interface UpdateSessionParams {
    id: number
    content: string
    tokenId: string
}

export class SessionModel {
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
        await this.prisma.delete({
            where: {
                id: refreshToken,
            },
        })
    }

    findById(refreshToken: string): Promise<Session | null> {
        return this.prisma.findUnique({
            where: {
                id: refreshToken,
            },
        })
    }
}
