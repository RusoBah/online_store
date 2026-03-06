import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

router.get('/getall', productController.getAll);
router.get('/getone/:id', productController.getOne);
router.post('/create', productController.create);
router.put('/update/:id', productController.update);
router.delete('/delete/:id', productController.delete);

export default router;
