import { Router } from "express";
import categoryController from '../controllers/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import validate from '../middleware/validate.js';
import { categoryValidation } from '../middleware/validations.js';

const router = Router();

router.get('/getall', categoryController.getAll);
router.get('/getone/:id', categoryValidation.getOne, validate, categoryController.getOne);
router.post('/create', authMiddleware, adminMiddleware, categoryValidation.create, validate, categoryController.create);
router.put('/update/:id', authMiddleware, adminMiddleware, categoryValidation.update, validate, categoryController.update);
router.delete('/delete/:id', authMiddleware, adminMiddleware, categoryValidation.delete, validate, categoryController.delete);

export default router;
