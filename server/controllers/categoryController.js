import { Category } from '../models/mapping.js';
import Logger from '../middleware/Logger.js';

class CategoryController {
    /**
     * Получает список всех категорий из БД.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async getAll(req, res) {
        try {
            Logger.info('Получение всех категорий');
            const categories = await Category.findAll();
            res.json(categories);
        } catch (e) {
            Logger.error('Ошибка при получении категорий: ' + e.message, e);
            res.status(500).json({ message: 'Ошибка при получении категорий: ' + e.message });
        }
    }

    /**
     * Получает данные одной категории по её идентификатору.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async getOne(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`Получение категории с ID: ${id}`);
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Категория не найдена' });
            }
            res.json(category);
        } catch (e) {
            Logger.error('Ошибка при получении категории: ' + e.message, e);
            res.status(500).json({ message: 'Ошибка при получении категории: ' + e.message });
        }
    }

    /**
     * Создает новую категорию.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Необходимо поле: name' });
            }
            Logger.info(`Создание категории с именем: ${name}`);
            const category = await Category.create({ name });
            Logger.info(`Категория создана с ID: ${category.id}`);
            res.status(201).json(category);
        } catch (e) {
            Logger.error('Не удалось создать категорию: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось создать категорию: ' + e.message });
        }
    }

    /**
     * Обновляет категорию.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            Logger.info(`Обновление категории с ID: ${id}`);
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Категория не найдена' });
            }
            if (name) {
                category.name = name;
                await category.save();
            }
            Logger.info(`Категория с ID: ${id} обновлена`);
            res.json(category);
        } catch (e) {
            Logger.error('Не удалось обновить категорию: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось обновить категорию: ' + e.message });
        }
    }

    /**
     * Удаляет категорию.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`Удаление категории с ID: ${id}`);
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Категория не найдена' });
            }
            await category.destroy();
            Logger.info(`Категория с ID: ${id} удалена`);
            res.json({ message: 'Категория удалена', category });
        } catch (e) {
            Logger.error('Не удалось удалить категорию: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось удалить категорию: ' + e.message });
        }
    }
}

export default new CategoryController();
