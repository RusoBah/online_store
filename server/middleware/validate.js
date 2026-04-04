import { validationResult } from 'express-validator'
import AppError from '../errors/AppError.js'

/**
 * Middleware для обработки результатов валидации
 */
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(e => ({
            field: e.path,
            message: e.msg
        }))
        return next(AppError.badRequest('Ошибка валидации данных', errorDetails))
    }
    next()
}

export default validate
