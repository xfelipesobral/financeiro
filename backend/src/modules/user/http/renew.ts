import { Request, Response } from 'express'
import { SessionService } from '../../session/service'

export async function renew(req: Request, res: Response) {
    const { refreshToken } = req.body

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' })
        return
    }

    try {
        const accessToken = await new SessionService().renew(refreshToken, req.headers['user-agent'] || 'unknown')
        res.status(200).json({ accessToken })
        return
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
        return
    }
}
