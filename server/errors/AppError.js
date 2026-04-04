class AppError extends Error {
    constructor(status, message, details = null) {
        super()
        this.status = status
        this.message = message
        this.details = details
    }

    static badRequest(message, details = null) {
        return new AppError(400, message, details)
    }

    static internalServerError(message) {
        return new AppError(500, message)
    }

    static forbidden(message) {
        return new AppError(403, message)
    }

    static notFound(message) {
        return new AppError(404, message)
    }
}

export default AppError