import { Router } from 'express';
import brandController from '../controllers/brandController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import validate from '../middleware/validate.js';
import { brandValidation } from '../middleware/validations.js';

const router = new Router();

router.get('/getall', brandController.getAll);
router.get('/getone/:id', brandValidation.getOne, validate, brandController.getOne);
router.post('/create', authMiddleware, adminMiddleware, brandValidation.create, validate, brandController.create);
router.put('/update/:id', authMiddleware, adminMiddleware, brandValidation.update, validate, brandController.update);
router.delete('/delete/:id', authMiddleware, adminMiddleware, brandValidation.delete, validate, brandController.delete);

export default router;
