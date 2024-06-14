import { Request, Response } from 'express'
import { SessionService } from '../../session/service'

export async function renew(req: Request, res: Response) {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' })
    }

    try {
        const accessToken = await new SessionService().renewAcessToken(refreshToken, req.headers['user-agent'] || 'unknown')
        return res.status(200).json({ accessToken })
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message })
    }
}