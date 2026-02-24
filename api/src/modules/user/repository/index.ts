import { User } from '../../../../prisma/generated/client'
import { prisma } from '../../../db'

export class UserRepository {
    private user = prisma.user

    findById(id: number): Promise<User | null> {
        return this.user.findUnique({
            where: {
                id,
            },
        })
    }

    findByGuid(guid: string): Promise<User | null> {
        return this.user.findUnique({
            where: {
                guid,
            },
        })
    }

    findByEmail(email: string): Promise<User | null> {
        return this.user.findUnique({
            where: {
                email,
            },
        })
    }

    findByEmailWithPassword(email: string, password: string): Promise<User | null> {
        return this.user.findUnique({
            where: {
                email,
                password,
            },
        })
    }

    create(guid: string, email: string, firstName: string, lastName: string, password: string) {
        return this.user.create({
            data: {
                guid,
                email,
                firstName,
                lastName,
                password,
            },
        })
    }
}
