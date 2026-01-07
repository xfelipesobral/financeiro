export class ApiError extends Error {
    public code: string
    public responseStatus: number

    constructor(code: string, message: string, responseStatus: number = 500) {
        super(message)
        this.code = code
        this.responseStatus = responseStatus

        Object.setPrototypeOf(this, new.target.prototype)
    }
}
