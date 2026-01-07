import { User } from '../../../../prisma/generated/client'

import { prisma } from '../../db'

export class UserRepository {
    private prisma = prisma.user

    findById(id: number): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                id,
            },
        })
    }

    findByGuid(guid: string): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                guid,
            },
        })
    }

    findByEmail(email: string): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                email,
            },
        })
    }

    findByEmailWithPassword(email: string, password: string): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                email,
                password,
            },
        })
    }
}
