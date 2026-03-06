import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = new Router();

// Основные маршруты авторизации
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Защищенный маршрут (сначала отрабатывает middleware, потом контроллер)
router.get('/check', authMiddleware, userController.check);

// Заглушки для остальных CRUD операций (для примера, не реализованы)
router.get('/getall', (req, res) => res.status(200).send('Список всех пользователей'));
router.get('/getone/:id', (req, res) => res.status(200).send('Получение одного пользователя'));
router.post('/create', (req, res) => res.status(200).send('Создание нового пользователя'));
router.put('/update/:id', (req, res) => res.status(200).send('Обновление пользователя'));
router.delete('/delete/:id', (req, res) => res.status(200).send('Удаление пользователя'));

export default router;