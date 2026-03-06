import ProductService from '../services/ProductService.js';
import Logger from '../middleware/Logger.js';

class ProductController {
    /**
     * Получает список всех товаров из БД.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
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
     * Получает данные одного товара по его идентификатору.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
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
     * Создает новый товар.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
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
     * Обновляет товар.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
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
     * Удаляет товар.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
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
