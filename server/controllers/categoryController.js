import { Category } from '../models/mapping.js';
import Logger from '../middleware/Logger.js';

class CategoryController {
    /**
     * @swagger
     * /category/getall:
     *   get:
     *     summary: Получить список всех категорий
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: Список категорий
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
     * @swagger
     * /category/getone/{id}:
     *   get:
     *     summary: Получить категорию по ID
     *     tags: [Categories]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID категории
     *     responses:
     *       200:
     *         description: Данные категории
     *       404:
     *         description: Категория не найдена
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
     * @swagger
     * /category/create:
     *   post:
     *     summary: Создать новую категорию
     *     tags: [Categories]
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
     *         description: Категория создана
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
     * @swagger
     * /category/update/{id}:
     *   put:
     *     summary: Обновить категорию
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID категории
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
     *         description: Категория обновлена
     *       404:
     *         description: Категория не найдена
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
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
     * @swagger
     * /category/delete/{id}:
     *   delete:
     *     summary: Удалить категорию
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID категории
     *     responses:
     *       200:
     *         description: Категория удалена
     *       404:
     *         description: Категория не найдена
     *       401:
     *         description: Не авторизован
     *       403:
     *         description: Нет прав (требуется ADMIN)
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
