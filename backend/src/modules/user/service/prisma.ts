import { User } from '@prisma/client'

import { prisma } from '../../db'

export class UserModel {
    private prisma = prisma.user

    findById(id: string): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                id
            }
        })
    }

    findByEmail(email: string): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                email
            }
        })
    }

    findByEmailWithPassword(email: string, password: string): Promise<User | null> {
        return this.prisma.findUnique({
            where: {
                email,
                password
            }
        })
    }
}