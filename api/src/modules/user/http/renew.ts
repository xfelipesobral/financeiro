import { Request, Response } from 'express'
import { SessionService } from '../../session/service'
import { ApiError } from '../../../utils/error'

export async function renew(req: Request, res: Response) {
    const { refreshToken } = req.body

    if (!refreshToken) {
        res.status(400).json({ error: { code: 'REQUIRED_FIELDS_MISSING', message: 'Refresh token is required' } })
        return
    }

    try {
        const accessToken = await new SessionService().renew(refreshToken, req.headers['user-agent'] || 'unknown')
        res.status(200).json({ accessToken })
        return
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.responseStatus).json({
                error: {
                    code: error.code,
                    message: error.message,
                },
            })
            return
        }

        res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: (error as Error).message } })
        return
    }
}
