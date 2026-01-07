import { Request, Response } from 'express'
import { UserService } from '../service'

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
    }

    try {
        const auth = await new UserService().authenticate(email, password, req.headers['user-agent'] || 'unknown')

        res.status(200).json(auth)
        return
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
        return
    }
}
