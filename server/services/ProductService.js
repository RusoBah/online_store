import { Product } from "../models/mapping.js";
import Logger from "../middleware/Logger.js";
import FileService from "./FileService.js";

class ProductService {
    async getAll({ brandId, categoryId, limit, offset } = {}) {
        try {
            Logger.info("Получение всех товаров");
            const whereClause = {};

            if (brandId) whereClause.brandId = brandId;
            if (categoryId) whereClause.categoryId = categoryId;

            const products = await Product.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
            return products;
        } catch (error) {
            Logger.error(`Ошибка при получении товаров: ${error.message}`);
            throw error;
        }
    }

    async getOne(id) {
        try {
            Logger.info(`Получение товара с ID: ${id}`);
            const product = await Product.findByPk(id);

            if (!product) {
                Logger.error(`Товар с ID: ${id} не найден`);
                throw new Error('Товар не найден');
            }

            return product;
        } catch (error) {
            Logger.error(`Ошибка при получении товара: ${error.message}`);
            throw error;
        }
    }

    async create(data, img) {
        try {
            Logger.info("Создание нового товара");

            if (!data.name || !data.price) {
                throw new Error('Необходимы поля: name, price');
            }

            const image = img ? FileService.save(img) : '';
            const { name, price, categoryId = null, brandId = null } = data;

            const product = await Product.create({ name, price, image, categoryId, brandId });
            Logger.info(`Товар создан с ID: ${product.id}`);

            return product;
        } catch (error) {
            Logger.error(`Ошибка при создании товара: ${error.message}`);
            throw error;
        }
    }

    async update(id, data, img) {
        try {
            Logger.info(`Обновление товара с ID: ${id}`);
            const product = await Product.findByPk(id);
            if (!product) {
                Logger.error(`Товар с ID: ${id} не найден в БД`);
                throw new Error('Товар не найден в БД');
            }

            // Удаляем старое изображение, если загружено новое
            if (img && product.image) {
                FileService.delete(product.image);
            }

            const {
                name = product.name,
                price = product.price,
                categoryId = product.categoryId,
                brandId = product.brandId,
                rating = product.rating
            } = data;

            const image = img ? FileService.save(img) : product.image;

            await product.update({ name, price, categoryId, brandId, rating, image });
            Logger.info(`Товар с ID: ${id} успешно обновлен`);
            return product;
        } catch (error) {
            Logger.error(`Ошибка при обновлении товара: ${error.message}`);
            throw error;
        }
    }

    async delete(id) {
        try {
            Logger.info(`Удаление товара с ID: ${id}`);
            const product = await Product.findByPk(id);
            if (!product) {
                Logger.error(`Товар с ID: ${id} не найден в БД`);
                throw new Error('Товар не найден в БД');
            }

            // Удаляем изображение
            if (product.image) {
                FileService.delete(product.image);
            }

            await product.destroy();
            Logger.info(`Товар с ID: ${id} удален`);
            return product;
        } catch (error) {
            Logger.error(`Ошибка при удалении товара: ${error.message}`);
            throw error;
        }
    }
}

export default new ProductService();
