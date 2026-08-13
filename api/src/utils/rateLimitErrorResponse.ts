export function rateLimitErrorResponseBuilder() {
    return {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Muitas requisições. Tente novamente em alguns minutos.',
        },
    }
}
