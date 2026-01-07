import { NextFunction, Request, Response } from 'express'

import { UserService } from '../modules/user/service'

import { verifyAcessToken } from '../utils/token'

export async function authenticated(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization

    if (!bearerToken) {
        res.status(401).json({ message: 'Token missing!' })
        return
    }

    // Remove o comeco do bearer token
    const token = bearerToken.replace('Bearer ', '')

    let userId: undefined | string

    try {
        const { sub } = verifyAcessToken(token)

        if (!sub) throw new Error('Token invalid')
        if (typeof sub !== 'string') throw new Error('Token invalid')

        userId = sub
    } catch {
        res.status(401).json({ message: 'Token invalid!' })
        return
    }

    const userToken = await new UserService().findByGuid(userId)

    if (!userToken) {
        res.status(401).json({ message: 'User not found!' })
        return
    }

    req.user = { id: userToken.id }

    next()
}
