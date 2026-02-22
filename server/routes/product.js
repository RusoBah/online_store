import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

/* Теперь вместо того, чтобы писать логику (req, res) => { ... } прямо здесь,
    мы просто передаем ссылку на нужный метод из контроллера.
*/

router.get('/getall', productController.getAll);

router.get('/getone/:id', productController.getOne);
router.post('/create', productController.create);

// Для update и delete мы контроллер еще не писали, оставим пока заглушки
router.put('/update/:id', (req, res) => res.status(200).send('Обновление товара'));
router.delete('/delete/:id', (req, res) => res.status(200).send('Удаление товара'));

export default router;