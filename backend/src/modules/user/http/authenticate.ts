import { Request, Response } from 'express'
import { UserService } from '../service'

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const auth = await new UserService().authenticate(email, password, req.headers['user-agent'] || 'unknown')
        return res.status(200).json(auth)
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message })
    }
}