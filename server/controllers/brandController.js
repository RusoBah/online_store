import { Brand } from '../models/mapping.js';
import Logger from '../middleware/Logger.js';

class BrandController {
    /**
     * @swagger
     * /brand/getall:
     *   get:
     *     summary: Получить список всех брендов
     *     tags: [Brands]
     *     responses:
     *       200:
     *         description: Список брендов
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
     * @swagger
     * /brand/getone/{id}:
     *   get:
     *     summary: Получить бренд по ID
     *     tags: [Brands]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID бренда
     *     responses:
     *       200:
     *         description: Данные бренда
     *       404:
     *         description: Бренд не найден
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
     * @swagger
     * /brand/create:
     *   post:
     *     summary: Создать новый бренд
     *     tags: [Brands]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: Бренд создан
     *       400:
     *         description: Ошибка валидации
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
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
     * @swagger
     * /brand/update/{id}:
     *   put:
     *     summary: Обновить бренд
     *     tags: [Brands]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID бренда
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       200:
     *         description: Бренд обновлен
     *       404:
     *         description: Бренд не найден
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
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
     * @swagger
     * /brand/delete/{id}:
     *   delete:
     *     summary: Удалить бренд
     *     tags: [Brands]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID бренда
     *     responses:
     *       200:
     *         description: Бренд удален
     *       404:
     *         description: Бренд не найден
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
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
