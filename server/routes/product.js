import { Router } from "express";
import productController from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import validate from "../middleware/validate.js";
import { productValidation, paginationValidation } from "../middleware/validations.js";

const router = Router();

router.get('/getall', paginationValidation, validate, productController.getAll);
router.get('/getone/:id', productValidation.getOne, validate, productController.getOne);
router.post('/create', authMiddleware, adminMiddleware, productValidation.create, validate, productController.create);
router.put('/update/:id', authMiddleware, adminMiddleware, productValidation.update, validate, productController.update);
router.delete('/delete/:id', authMiddleware, adminMiddleware, productValidation.delete, validate, productController.delete);

export default router;
