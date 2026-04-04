import AppError from '../errors/AppError.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Централизованный middleware для обработки ошибок
 * @param {Error} err - объект ошибки
 * @param {Object} req - объект запроса Express
 * @param {Object} res - объект ответа Express
 * @param {Function} next - функция next Express
 */
const error = (err, req, res, next) => {
    const errorId = uuidv4()
    const isDevelopment = process.env.NODE_ENV !== 'production'
    
    // Логирование ошибки
    logError(err, errorId, req)

    // Обработка известных ошибок приложения
    if (err instanceof AppError) {
        return res.status(err.status).json({
            message: err.message,
            errorId,
            ...(err.details && { details: err.details }),
            ...(isDevelopment && { stack: err.stack })
        })
    }

    // Обработка ошибок валидации Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: 'Ошибка валидации данных',
            errors: err.errors.map(e => ({
                field: e.path,
                message: e.message
            })),
            errorId,
            ...(isDevelopment && { stack: err.stack })
        })
    }

    // Обработка уникальных ограничений Sequelize
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            message: 'Данное значение уже существует',
            field: err.fields ? Object.keys(err.fields)[0] : 'unknown',
            errorId,
            ...(isDevelopment && { stack: err.stack })
        })
    }

    // Обработка ошибок базы данных Sequelize
    if (err.name?.includes('Sequelize')) {
        return res.status(500).json({
            message: 'Ошибка базы данных',
            errorId,
            ...(isDevelopment && { stack: err.stack })
        })
    }

    // Обработка синтаксических ошибок JSON
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            message: 'Некорректный JSON в теле запроса',
            errorId,
            ...(isDevelopment && { details: err.message })
        })
    }

    // Обработка ошибок файлов
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            message: 'Размер файла превышает допустимый лимит',
            errorId
        })
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(413).json({
            message: 'Количество файлов превышает допустимый лимит',
            errorId
        })
    }

    // Обработка ошибок отсутствия ресурса
    if (err.statusCode === 404) {
        return res.status(404).json({
            message: 'Ресурс не найден',
            errorId
        })
    }

    // Обработка неожиданных ошибок
    return res.status(err.status || 500).json({
        message: err.message || 'Внутренняя ошибка сервера',
        errorId,
        ...(isDevelopment && { stack: err.stack, originalError: err.toString() })
    })
}

/**
 * Логирует ошибку с контекстом запроса
 * @param {Error} err - объект ошибки
 * @param {string} errorId - уникальный ID ошибки
 * @param {Object} req - объект запроса
 */
const logError = (err, errorId, req) => {
    const timestamp = new Date().toISOString()
    const method = req.method
    const url = req.originalUrl
    const ip = req.ip
    
    console.error(`[${timestamp}] Error ID: ${errorId}`)
    console.error(`Request: ${method} ${url} from ${ip}`)
    console.error(`Type: ${err.name}`)
    console.error(`Message: ${err.message}`)
    console.error(err.stack)
    console.error('---')
}

export default error