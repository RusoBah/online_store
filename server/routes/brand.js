import { Router } from 'express';
import brandController from '../controllers/brandController.js';
const router = new Router();

router.get('/getall', brandController.getAll);
router.post('/create', brandController.create);

export default router;