import bcrypt from 'bcrypt';
import { User, Basket } from '../models/mapping.js';
import AppError from '../errors/AppError.js';
import { makeJwt } from '../middleware/authMiddleware.js';

class UserService {
    
    async signup(email, password, role) {
        if (!email || !password) {
            throw AppError.badRequest('Некорректные данные для регистрации');
        }

        // Проверяем, существует ли пользователь
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw AppError.badRequest('Пользователь с таким email уже существует');
        }

        // Хэшируем пароль 5 циклов для безопасности
        const hashPassword = await bcrypt.hash(password, 5);

        // Создаем пользователя
        const user = await User.create({ email, password: hashPassword, role });

        // Создаем корзину для пользователя
        await Basket.create({ userId: user.id });

        // Генерируем JWT токен
        const token = makeJwt(user.id, user.email, user.role);
        return token;
    }

    async login (email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw AppError.badRequest('Пользователь с таким email не найден');
        }

        // Cравнение пароля с хэшем в БД
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            throw AppError.badRequest('Неверный пароль');
        }

        const token = makeJwt(user.id, user.email, user.role);
        return token;
    }

    // ГЕНЕРАЦИЯ нового токена для обновления сессии 
    async check (id, email, role) {
        const token = makeJwt(id, email, role);
        return token;
    }
}

export default new UserService();
