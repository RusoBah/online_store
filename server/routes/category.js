import { Router } from "express";
import categoryController from '../controllers/categoryController.js'; // Импорт

const router = Router();


router.get('/getall', categoryController.getAll);
router.post('/create', categoryController.create);

export default router;