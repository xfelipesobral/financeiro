import { NextFunction, Request, Response } from 'express'

import { UserService } from '../modules/user/service'

import { verifyAcessToken } from '../utils/token'

export async function authenticated(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization

    if (!bearerToken) {
        return res.status(401).json({ message: 'Token missing!' })
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
        return res.status(401).json({ message: 'Token invalid!' })
    }

    if (!(await new UserService().findById(userId))) {
        return res.status(401).json({ message: 'User not found!' })
    }

    req.user = { id: userId }

    next()
}
