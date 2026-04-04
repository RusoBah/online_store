import ProductService from '../services/ProductService.js';
import Logger from '../middleware/Logger.js';

class ProductController {
    /**
     * @swagger
     * /product/getall:
     *   get:
     *     summary: Получить список всех товаров
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: brandId
     *         schema:
     *           type: integer
     *         description: ID бренда для фильтрации
     *       - in: query
     *         name: categoryId
     *         schema:
     *           type: integer
     *         description: ID категории для фильтрации
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Номер страницы
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 9
     *         description: Количество товаров на странице
     *     responses:
     *       200:
     *         description: Список товаров
     *       500:
     *         description: Ошибка сервера
     */
    async getAll(req, res) {
        try {
            Logger.info('Получение списка товаров');
            let { brandId, categoryId, limit, page } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;

            const products = await ProductService.getAll({ brandId, categoryId, limit, offset });
            Logger.info(`Получено товаров: ${products.rows.length}`);
            res.json(products);
        } catch (e) {
            Logger.error('Ошибка при получении товаров: ' + e.message, e);
            res.status(500).json({ message: 'Ошибка при получении товаров: ' + e.message });
        }
    }

    /**
     * @swagger
     * /product/getone/{id}:
     *   get:
     *     summary: Получить товар по ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID товара
     *     responses:
     *       200:
     *         description: Данные товара
     *       404:
     *         description: Товар не найден
     */
    async getOne(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`Получение товара с ID: ${id}`);
            const product = await ProductService.getOne(id);
            res.json(product);
        } catch (e) {
            Logger.error('Ошибка при получении товара: ' + e.message, e);
            res.status(404).json({ message: 'Товар не найден' });
        }
    }

    /**
     * @swagger
     * /product/create:
     *   post:
     *     summary: Создать новый товар
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *               categoryId:
     *                 type: integer
     *               brandId:
     *                 type: integer
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Товар создан
     *       400:
     *         description: Ошибка валидации
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     */
    async create(req, res) {
        try {
            const { name, price, categoryId, brandId } = req.body;
            const { image } = req.files || {};

            Logger.info(`Создание товара: ${name}`);
            const product = await ProductService.create(
                { name, price, categoryId, brandId },
                image
            );
            Logger.info(`Товар создан с ID: ${product.id}`);
            res.status(201).json(product);
        } catch (e) {
            Logger.error('Не удалось создать товар: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось создать товар: ' + e.message });
        }
    }

    /**
     * @swagger
     * /product/update/{id}:
     *   put:
     *     summary: Обновить товар
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID товара
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               price:
     *                 type: number
     *               categoryId:
     *                 type: integer
     *               brandId:
     *                 type: integer
     *               rating:
     *                 type: number
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Товар обновлен
     *       400:
     *         description: Ошибка валидации
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price, categoryId, brandId, rating } = req.body;
            const { image } = req.files || {};

            Logger.info(`Обновление товара с ID: ${id}`);
            const product = await ProductService.update(
                id,
                { name, price, categoryId, brandId, rating },
                image
            );
            Logger.info(`Товар с ID: ${id} обновлен`);
            res.json(product);
        } catch (e) {
            Logger.error('Не удалось обновить товар: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось обновить товар: ' + e.message });
        }
    }

    /**
     * @swagger
     * /product/delete/{id}:
     *   delete:
     *     summary: Удалить товар
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID товара
     *     responses:
     *       200:
     *         description: Товар удален
     *       400:
     *         description: Ошибка при удалении
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`Удаление товара с ID: ${id}`);
            const product = await ProductService.delete(id);
            Logger.info(`Товар с ID: ${id} удален`);
            res.json({ message: 'Товар удален', product });
        } catch (e) {
            Logger.error('Не удалось удалить товар: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось удалить товар: ' + e.message });
        }
    }
}

export default new ProductController();
