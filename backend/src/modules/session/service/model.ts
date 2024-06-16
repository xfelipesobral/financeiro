import { Session } from '@prisma/client'

export interface UpdateSessionParams { 
    id: string, 
    content: string, 
    tokenId: string
}

export interface SessionFunctionsModel {
    create(userId: string, tokenId: string, identifier?: string): Promise<string>
    delete(refreshToken: string): Promise<void>
    findById(refreshToken: string): Promise<Session | null>
    update(params: UpdateSessionParams): Promise<void>
}

export interface SessionFunctionsService {
    validate(refreshToken: string): Promise<boolean>
    renew(refreshToken: string, identifier: string): Promise<string>
}