import { Session } from '@prisma/client'
import { prisma } from '../../db'
import { v4 as uuid } from 'uuid'

interface UpdateSessionParams { 
    id: string, 
    content: string, 
    tokenId: string
}

export class SessionModel  {
    private prisma = prisma.session

    async update({ id, content, tokenId }: UpdateSessionParams): Promise<void> {
        await this.prisma.update({
            where: {
                id
            },
            data: {
                content,
                tokenId
            }
        })
    }

    async create(userId: string, tokenId: string, identifier: string = 'UNKNOW'): Promise<string> {
        const id = uuid()

        await this.prisma.create({
            data: {
                id,
                tokenId,
                userId,
                content: '',
                identifier
            }
        })

        return id
    }

    async delete(refreshToken: string): Promise<void> {
        await this.prisma.delete({
            where: {
                id: refreshToken
            }
        })
    }

    findById(refreshToken: string): Promise<Session | null> {
        return this.prisma.findUnique({
            where: {
                id: refreshToken
            }
        })
    }
}