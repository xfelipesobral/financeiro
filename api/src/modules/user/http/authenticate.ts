import { Request, Response } from 'express'
import { UserService } from '../service'
import { ApiError } from '../../../utils/error'

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({
            error: {
                code: 'REQUIRED_FIELDS_MISSING',
                message: 'Email and password are required fields.',
            },
        })
        return
    }

    try {
        const auth = await new UserService().authenticate(email, password, req.headers['user-agent'] || 'unknown')

        res.status(200).json(auth)
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

        res.status(500).json({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: (error as Error).message,
            },
        })
        return
    }
}
