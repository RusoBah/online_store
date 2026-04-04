import jwt from 'jsonwebtoken'
import Logger from './Logger.js'
import AppError from '../errors/AppError.js'

export const makeJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

const auth = (req, res, next) => {
    if (req.method === 'OPTIONS') return next()
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization
        if (!authHeader) return next(AppError.forbidden('Пользователь не авторизован'))

        const token = authHeader.split(' ')[1]
        if (!token) return next(AppError.forbidden('Пользователь не авторизован'))

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.auth = decoded
        next()
    } catch (e) {
        Logger.error('Ошибка авторизации', e)
        next(AppError.forbidden('Неверный токен авторизации'))
    }
}

export default auth 