import { User } from '@prisma/client'

export interface UserFunctionsModel {
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findByEmailWithPassword(email: string, password: string): Promise<User | null>
}

export interface UserFunctionsService {
    authenticate(email: string, password: string, indentifier?: string): Promise<{ accessToken: string, refreshToken: string }>
}