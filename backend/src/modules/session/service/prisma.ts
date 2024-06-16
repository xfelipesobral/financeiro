import { PrismaClient, Session } from '@prisma/client'
import { v4 as uuid } from 'uuid'

import { SessionFunctionsModel, UpdateSessionParams } from './model'

export class SessionModel implements SessionFunctionsModel {
    private prisma = new PrismaClient().session

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