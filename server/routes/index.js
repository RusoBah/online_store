import { Router } from "express";
import productRouter from './product.js';
import categoryRouter from './category.js';
import brandRouter from './brand.js';
import userRouter from './user.js';


const router = new Router();

router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/brand', brandRouter);
router.use('/user', userRouter);

export default router;