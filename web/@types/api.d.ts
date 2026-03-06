interface ResponseError {
    error: {
        code: string
        message: string
    }
}

interface ResponseApi<T> {
    success: boolean
    data?: T
    message?: string
}
