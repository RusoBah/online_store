import { Category } from '../models/mapping.js';

class CategoryController {
    /**
     * Получает список всех категорий из БД.
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    async getAll(req,res) {
        try{
            const categorys = await Category.findAll();
            res.json(categorys);
        } catch (e){
            res.status(500).json({ message: "Ошибка при получении категорий: " + e.message });
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
            const category = await Category.create({ name });
            res.status(201).json(category);
        } catch (e) {
            res.status(400).json({ message: "Не удалось создать категорию: " + e.message });
        }
    }
}


export default new CategoryController();