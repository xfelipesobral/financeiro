import { FastifyRequest } from 'fastify'

export function extractInfosFromRequest(request: FastifyRequest) {
    const origin = (request.headers['origin'] || '').toLocaleLowerCase()
    const userAgent = (request.headers['user-agent'] || '').toLowerCase()
    const ip =
        (request.headers['cf-connecting-ip'] as string) ||
        (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        (request.headers['x-real-ip'] as string) ||
        request.socket.remoteAddress ||
        ''

    return { origin, userAgent, ip }
}
