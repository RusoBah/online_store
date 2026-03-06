import { Router } from "express";
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.get('/getall', categoryController.getAll);
router.get('/getone/:id', categoryController.getOne);
router.post('/create', categoryController.create);
router.put('/update/:id', categoryController.update);
router.delete('/delete/:id', categoryController.delete);

export default router;
