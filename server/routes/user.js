import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import validate from '../middleware/validate.js';
import { userValidation } from '../middleware/validations.js';

const router = new Router();

// Основные маршруты авторизации (публичные)
router.post('/signup', userValidation.signup, validate, userController.signup);
router.post('/login', userValidation.login, validate, userController.login);

// Защищенный маршрут (сначала отрабатывает middleware, потом контроллер)
router.get('/check', authMiddleware, userController.check);

// CRUD операции - только для администраторов
router.get('/getall', authMiddleware, adminMiddleware, userController.getAll);
router.get('/getone/:id', authMiddleware, adminMiddleware, userValidation.getOne, validate, userController.getOne);
router.put('/update/:id', authMiddleware, adminMiddleware, userValidation.update, validate, userController.update);
router.delete('/delete/:id', authMiddleware, adminMiddleware, userValidation.delete, validate, userController.delete);

export default router;