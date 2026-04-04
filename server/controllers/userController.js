import UserService from "../services/UserService.js";
import Logger from "../middleware/Logger.js";

class UserController {
    /**
     * @swagger
     * /user/signup:
     *   post:
     *     summary: Регистрация нового пользователя
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               role:
     *                 type: string
     *                 enum: [USER, ADMIN]
     *     responses:
     *       200:
     *         description: JWT токен
     *       400:
     *         description: Ошибка валидации
     */
    async signup(req, res, next) {
        try {
            const { email, password, role } = req.body;
            const token = await UserService.signup(email, password, role);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: Вход пользователя
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: JWT токен
     *       400:
     *         description: Неверные данные
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /user/check:
     *   get:
     *     summary: Проверка токена аутентификации
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Новый JWT токен
     *       401:
     *         description: Неавторизованный запрос
     */
    async check(req, res, next) {
        try {
            const token = await UserService.check(req.auth.id, req.auth.email, req.auth.role);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /user/getall:
     *   get:
     *     summary: Получить всех пользователей
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Список пользователей
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     */
    async getAll(req, res, next) {
        try {
            Logger.info('Получение списка всех пользователей');
            const users = await UserService.getAll();
            res.json(users);
        } catch (error) {
            Logger.error('Ошибка при получении пользователей: ' + error.message, error);
            next(error);
        }
    }

    /**
     * @swagger
     * /user/getone/{id}:
     *   get:
     *     summary: Получить пользователя по ID
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID пользователя
     *     responses:
     *       200:
     *         description: Данные пользователя
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     *       404:
     *         description: Пользователь не найден
     */
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            Logger.info(`Получение пользователя с ID: ${id}`);
            const user = await UserService.getOne(id);
            res.json(user);
        } catch (error) {
            Logger.error('Ошибка при получении пользователя: ' + error.message, error);
            next(error);
        }
    }

    /**
     * @swagger
     * /user/update/{id}:
     *   put:
     *     summary: Обновить пользователя
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID пользователя
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               role:
     *                 type: string
     *                 enum: [USER, ADMIN]
     *     responses:
     *       200:
     *         description: Пользователь обновлен
     *       400:
     *         description: Ошибка валидации
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { email, password, role } = req.body;
            Logger.info(`Обновление пользователя с ID: ${id}`);
            const user = await UserService.update(id, { email, password, role });
            Logger.info(`Пользователь с ID: ${id} обновлен`);
            res.json(user);
        } catch (error) {
            Logger.error('Ошибка при обновлении пользователя: ' + error.message, error);
            next(error);
        }
    }

    /**
     * @swagger
     * /user/delete/{id}:
     *   delete:
     *     summary: Удалить пользователя
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID пользователя
     *     responses:
     *       200:
     *         description: Пользователь удален
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     *       404:
     *         description: Пользователь не найден
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            Logger.info(`Удаление пользователя с ID: ${id}`);
            await UserService.delete(id);
            Logger.info(`Пользователь с ID: ${id} удален`);
            res.json({ message: 'Пользователь удален' });
        } catch (error) {
            Logger.error('Ошибка при удалении пользователя: ' + error.message, error);
            next(error);
        }
    }
}

export default new UserController();
