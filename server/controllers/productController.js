import {
    v4 as uuidv4
} from 'uuid';
import {
    Product
} from '../models/mapping.js';

class ProductController {
    /**
     * Получает список всех товаров из БД.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getAll(req, res) {
        try {
            let {
                brandId,
                categoryId,
                limit,
                page
            } = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;

            let products;
            const whereClause = {};

            if (brandId)
                whereClause.brandId = brandId;
            if (categoryId)
                whereClause.categoryId = categoryId;

            // findAndCountAll вернет и массив товаров, и общее кол-во (для фронтенда)
            products = await Product.findAndCountAll({
                where: whereClause,
                limit,
                offset
            });
            res.json(products);
        } catch (e) {
            res.status(500).json({
                message: "Ошибка при получении товаров: " + e.message
            });
        }
    }

    /**
     * Получает данные одного товара по его идентификатору.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getOne(req, res) {
        try {
            const {
                id
            } = req.params;
            const product = await Product.findByPk(id);

            if (!product)
                return res.status(404).json({
                    message: 'Товар не найден'
                });

            res.json(product);
        } catch (e) {
            res.status(500).json({
                message: "Ошибка сервера: " + e.message
            });
        }
    }

    /**
     * Создает новый товар.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async create(req, res) {
        try {
            const {
                name,
                price,
                categoryId,
                brandId
            } = req.body;
            const {
                image
            } = req.files; // Получаем файл

            let fileName = uuidv4() + '.jpg'; // Генерация уникального имени
            image.mv(path.resolve(process.cwd(), 'static', fileName));
            const product = await Product.create({
                name,
                price,
                categoryId,
                brandId,
                image: fileName // В базу пишем только имя файла
            });
            res.status(201).json(product);
        } catch (e) {
            res.status(400).json({
                message: "Не удалось создать товар: " + e.message
            });
        }
    }
}


export default new ProductController();