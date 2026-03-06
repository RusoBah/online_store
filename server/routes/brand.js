import { Router } from 'express';
import brandController from '../controllers/brandController.js';

const router = new Router();

router.get('/getall', brandController.getAll);
router.get('/getone/:id', brandController.getOne);
router.post('/create', brandController.create);
router.put('/update/:id', brandController.update);
router.delete('/delete/:id', brandController.delete);

export default router;
