import { User } from '@prisma/client'

import { UserFunctionsModel } from './model'

import { prisma } from '../../db'

export class UserModel implements UserFunctionsModel {
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