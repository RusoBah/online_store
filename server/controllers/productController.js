import { Product } from '../models/mapping.js';

class ProductController {
    /**
     * Получает список всех товаров из БД.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getAll(req,res) {
        try{
            const products = await Product.findAll();
            res.json(products);
        } catch (e){
            res.status(500).json({ message: "Ошибка при получении товаров: " + e.message });
        }
    }

    /**
     * Получает данные одного товара по его идентификатору.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getOne(req, res) {
        try{
            const { id } = req.params;
            const product = await Product.findByPk(id);

            if (!product) 
                return res.status(404).json({message: 'Товар не найден'});

            res.json(product);
        } catch (e) {
            res.status(500).json({ message: "Ошибка сервера: " + e.message });
        }
    }

    /**
     * Создает новый товар.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async create(req, res) {
        try {
            const { name, price, rating, image, categoryId, brandId } = req.body;
            const product = await Product.create({ name, price, rating, image, categoryId, brandId });
            res.status(201).json(product);
        } catch (e) {
            res.status(400).json({ message: "Не удалось создать товар: " + e.message });
        }
    }
}


export default new ProductController();