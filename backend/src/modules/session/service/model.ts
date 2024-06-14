import { Session } from '@prisma/client'

export interface UpdateSessionParams { 
    id: string, 
    content: string, 
    tokenId: string
}

export interface SessionFunctionsModel {
    createSession(userId: string, tokenId: string, identifier?: string): Promise<string>
    deleteSession(refreshToken: string): Promise<void>
    findSession(refreshToken: string): Promise<Session | null>
    updateSession(params: UpdateSessionParams): Promise<void>
}

export interface SessionFunctionsService {
    validateSession(refreshToken: string): Promise<boolean>
    renewAcessToken(refreshToken: string, identifier: string): Promise<string>
}