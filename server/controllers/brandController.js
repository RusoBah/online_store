import { Brand } from '../models/mapping.js';
import Logger from '../middleware/Logger.js';

class BrandController {
    /**
     * Получает список всех брендов из БД.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async getAll(req, res) {
        try {
            Logger.info('Получение всех брендов');
            const brands = await Brand.findAll();
            res.json(brands);
        } catch (e) {
            Logger.error('Ошибка при получении брендов: ' + e.message, e);
            res.status(500).json({ message: 'Ошибка при получении брендов: ' + e.message });
        }
    }

    /**
     * Получает данные одного бренда по его идентификатору.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async getOne(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`Получение бренда с ID: ${id}`);
            const brand = await Brand.findByPk(id);

            if (!brand) {
                Logger.error(`Бренд с ID: ${id} не найден`);
                return res.status(404).json({ message: 'Бренд не найден' });
            }

            res.json(brand);
        } catch (e) {
            Logger.error('Ошибка сервера: ' + e.message, e);
            res.status(500).json({ message: 'Ошибка сервера: ' + e.message });
        }
    }

    /**
     * Создает новый бренд.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async create(req, res) {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Необходимо поле: name' });
            }
            Logger.info(`Создание бренда с именем: ${name}`);
            const brand = await Brand.create({ name });
            Logger.info(`Бренд создан с ID: ${brand.id}`);
            res.status(201).json(brand);
        } catch (e) {
            Logger.error('Не удалось создать бренд: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось создать бренд: ' + e.message });
        }
    }

    /**
     * Обновляет бренд.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            Logger.info(`Обновление бренда с ID: ${id}`);
            const brand = await Brand.findByPk(id);
            if (!brand) {
                return res.status(404).json({ message: 'Бренд не найден' });
            }
            if (name) {
                brand.name = name;
                await brand.save();
            }
            Logger.info(`Бренд с ID: ${id} обновлен`);
            res.json(brand);
        } catch (e) {
            Logger.error('Не удалось обновить бренд: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось обновить бренд: ' + e.message });
        }
    }

    /**
     * Удаляет бренд.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            Logger.info(`Удаление бренда с ID: ${id}`);
            const brand = await Brand.findByPk(id);
            if (!brand) {
                return res.status(404).json({ message: 'Бренд не найден' });
            }
            await brand.destroy();
            Logger.info(`Бренд с ID: ${id} удален`);
            res.json({ message: 'Бренд удален', brand });
        } catch (e) {
            Logger.error('Не удалось удалить бренд: ' + e.message, e);
            res.status(400).json({ message: 'Не удалось удалить бренд: ' + e.message });
        }
    }
}

export default new BrandController();
