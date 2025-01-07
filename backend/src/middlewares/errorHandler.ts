import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../errors'

/**
 * Cria um middleware para tratar erros customizados
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    return res.status(500).json({ message: 'Internal server error' })
}
